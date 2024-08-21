export interface AuthData {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email?: string | undefined | null;
  name?: string | undefined | null;
  role?: 'admin' | 'user' | 'super_admin' | undefined | null; 
}

export enum Repetition {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
export interface Events {
  id?: number | null;
  title: string;
  description: string;
  eventDate: Date;
  startDate: Date;
  endDate: Date;
  author?: User;
  repetition?: Repetition;
}

export interface CalendarEvent {
  id?: number | null;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  url?: string;
  classNames?: string[];
  editable?: boolean;
  extendedProps?: {
    description?: string;
  };
}

export enum LibraryVisibility {
  GENERAL = 'general',
  USERS = 'users',
  ADMIN = 'admin',
}

export interface Library {
  id: number;
  title: string;
  description: string;
  referenceDate: Date;
  author?: User;
  parent?: Library;
  children?: Library[];
  visibility: LibraryVisibility;
}

export enum TemplateType {
  NOTES = 'Notes',
  EVENTS = 'Events',
  PUBLICATIONS = 'Publications',
  OTHERS = 'Others',
}

export interface CreateLibraryDto {
  title: string;
  description: string;
  referenceDate: Date;
  parentNoteId?: number;
  visibility: LibraryVisibility;
}

export interface UpdateLibraryDto {
  title?: string;
  description?: string;
  referenceDate?: Date;
  parentNoteId?: number;
  visibility?: LibraryVisibility;
}

export interface Publication {
  id: number;
  title: string;
  content: {
    html: string;
    css?: string;
  };
  publicationDate: Date;
  author?: User;
}

export interface RouteApi {
  method: string;
  path: string;
}

export interface ResponseData {
  userData: User;
  access_token: string;
}


