import { IUser } from './models/user.model';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // Ensures that req.user has the IUser properties, including _id
      file?: { // Ensures req.file is properly typed when using file uploads
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
      };
    }
  }
}


