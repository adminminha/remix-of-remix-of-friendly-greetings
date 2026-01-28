-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  preview_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pages table
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  component_path TEXT,
  is_home BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create files table
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  content TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_roles (read-only for users)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for pages (access via project ownership)
CREATE POLICY "Users can view pages of their projects"
  ON public.pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = pages.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create pages for their projects"
  ON public.pages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = pages.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update pages of their projects"
  ON public.pages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = pages.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete pages of their projects"
  ON public.pages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = pages.project_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for files (access via project ownership)
CREATE POLICY "Users can view files of their projects"
  ON public.files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = files.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create files for their projects"
  ON public.files FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = files.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update files of their projects"
  ON public.files FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = files.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete files of their projects"
  ON public.files FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = files.project_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for chat_messages (access via project ownership)
CREATE POLICY "Users can view chat messages of their projects"
  ON public.chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = chat_messages.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create chat messages for their projects"
  ON public.chat_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = chat_messages.project_id
    AND projects.user_id = auth.uid()
  ));