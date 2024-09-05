export type HtmlCssContent = {
  html: string;
  css: string;
};

export const defaultHtmlCssContent: HtmlCssContent = {
  html: '',
  css: '',
};

export const exampleHtmlCssContent: HtmlCssContent = {
  html: '<h1>Cualquier HTML aqui</h1>',
  css: 'h1 { color: blue; }',
};

export interface AuthData {
  email: string;
  password: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User extends SharedProp {
  id: string;
  email: string;
  name?: string | undefined | null;
  role: UserRole;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export enum Repetition {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FIFTEEN_DAYS = 'fifteen_days',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface Events extends SharedProp {
  id?: number | null;
  title: string;
  description: HtmlCssContent;
  eventDate: Date;
  startDate: Date;
  endDate: Date;
  author?: User;
  repetition?: Repetition;
}

export interface CreateEventDto {
  title: string;
  description: HtmlCssContent;
  eventDate: Date;
  startDate: Date;
  endDate: Date;
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

export interface Library extends SharedProp {
  id: number;
  title: string;
  description: HtmlCssContent;
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
  description: HtmlCssContent;
  referenceDate: Date;
  parentNoteId?: number;
  visibility: LibraryVisibility;
}

export interface UpdateLibraryDto {
  title?: string;
  description?: HtmlCssContent;
  referenceDate?: Date;
  parentNoteId?: number;
  visibility?: LibraryVisibility;
}

export interface Publication extends SharedProp {
  id: number;
  title: string;
  content: HtmlCssContent;
  author?: User;
}

export enum LikeTarget {
  LIBRARY = 'library',
  PUBLICATION = 'publication',
  EVENT = 'event',
}

export interface Like {
  id: number;
  isLike: boolean;
  targetType: LikeTarget;
  targetId: number;
  user: User;
}

export interface CreatePublicationDto {
  title: string;
  content: HtmlCssContent;
}

export interface SharedProp {
  createdAt?: string;
  updatedAt?: string;
}

export interface RouteApi {
  method: string;
  path: string;
}

export interface ResponseData {
  userData: User;
  access_token: string;
}
