export interface AuthData {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email?: string | undefined | null;
  name?: string | undefined | null;
  role?: 'admin' | 'user'; 
  events?: Events[];
}
export interface Events {
  id?: number;
  title: string;
  description: string;
  eventDate: Date;
  startDate: Date;
  endDate: Date;
  author?: User;
  repetition?: string;
}

export interface CalendarEvent {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  repetition?: string;
  color?: string;
}

export interface Library {
  id: number;
  title: string;
  description: string;
  referenceDate: Date;
  author?: User;
  parent?: Library;
  children?: Library[];
}

export interface CreateLibraryDto {
  title: string;
  description: string;
  referenceDate: Date;
  parentNoteId?: number;
}

export interface UpdateLibraryDto {
  title?: string;
  description?: string;
  referenceDate?: Date;
  parentNoteId?: number;
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


