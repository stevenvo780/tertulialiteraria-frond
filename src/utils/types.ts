export interface AuthData {
  email: string;
  password: string;
}

export enum TypeDocuments {
  CC = 'CC',
  NIT = 'NIT',
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  logo: string;
  companyName: string;
  documentNumber: number,
  typeDocument: TypeDocuments;
  phone: string;
  products: Product[];
  invoices: Invoice[];
  clients: Client[];
  cashBoxes: CashBox[];
  Events: CashBox[];
  categoryPricing: CategoryPricing[];
  taxes: Taxes[];
}

export interface Client {
  id?: number;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
  documentNumber: string;
  invoices?: Invoice[];
  user?: User;
}

export interface SelectInterface {
  value: string | number,
  label: string,
}

export interface Invoice {
  id: number;
  date: Date;
  totalAmount: number;
  client: Client;
  iva?: number,
  withholdingTax?: number,
  consecutive?: number,
  invoiceItems: { productId: number; quantity: number }[];
  user?: User;
}

export interface Product {
  id?: number;
  name: string;
  sortName: string;
  description: string;
  image?: string;
  state: boolean;
  priceTypes: ProductPriceType[];
  categories: Category[];
  user?: User;
}

export enum Operators {
  Percentage = '%',
  Subtraction = '-',
}

export interface Events {
  id: number;
  name: string;
  value: number;
  operator: Operators;
  user: User;
}

export interface ProductPriceType {
  id?: number;
  category?: CategoryPricing;
  price?: number;
  events?: Events[];
  taxes?: Taxes[];
  user?: User;
}

export interface Taxes {
  id: number;
  name: string;
  value: number;
  operator: Operators;
  user: User;
}

export interface Category {
  id: number;
  name?: string;
  user?: User;
}

export interface CategoryPricing {
  id: number;
  name: string;
  user?: User;
}

export interface CashBox {
  id?: number;
  cashIn: number;
  cashOut: number;
  balance: number;
  user?: User;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface Webhook {
  id: number;
  bounceRoute: string;
  targetUrl: string;
  httpMethod: HttpMethod;
  user: User;
}

export interface Config {
  id?: number;
  iva: number;
  withholdingTax: number;
  initialConsecutive: number;
  finalConsecutive: number;
  currentConsecutive?: number;
  user?: User;
}

export interface RouteApi {
  method: string;
  path: string;
}

export interface ResponseData {
  userData: User;
  access_token: string;
}


