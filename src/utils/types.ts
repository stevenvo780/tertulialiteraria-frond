export interface AuthData {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email?: string | undefined | null;
  name?: string | undefined | null;
  events: Events[];
}
export interface Events {
  id?: number;
  title: string;
  description: string;
  eventDate: Date;
  startDate: Date;
  endDate: Date;
  author?: User;
}

export interface CalendarEvent {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
}

export interface Library {
  id: number;
  title: string;
  description: string;
  referenceDate: Date;
  author?: User;
}

export interface Publication {
  id: number;
  title: string;
  content: string;
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


