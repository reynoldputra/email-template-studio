import nodemailer from 'nodemailer';

export type TransportConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export const createTransport = (config: TransportConfig) => nodemailer.createTransport(config);
