import chalk from "chalk";
import { MongoClient, MongoClientOptions } from "mongodb";
import bcrypt from "bcrypt";
import { err_codes } from "./types";

// kırmızı arka planlı yeşil renkli yazı yazar
export const bgRedAndGreenText = (text: string): string => chalk.bgRed(chalk.green(text));

// // mongo client döndürür
// export const mongoClient = (uri: string, opt?: MongoClientOptions): MongoClient => new MongoClient(uri, opt);

// verilen şifreyi encrypted hale getirir bu sayede kullanıcıların
//şifrelerininin güvenli bir şekilde tutulmasını sağlar
export const hashPassword = async (password: string, saltRounds: number): Promise<string> => await bcrypt.hash(password, saltRounds);

// kullanıcının gönderdiği şifrenin encrypted şifre ile eşleşiyorsa true aksi taktirde false döndürür
export const comparePassword = async (password: string, hash: string): Promise<boolean> => await bcrypt.compare(password, hash);

// any error hatalarını, her seferinde tekrarlamamk için yazılmış bir fonksiyondur.
type AnyError = { success: boolean; data: { error: { message: string; code: err_codes } } };
export const anyError = (err: any): AnyError => {
  return {
    success: false,
    data: {
      error: {
        message: `[ Bir hata oluştu ]: ${err}`,
        code: err_codes.ANY_ERR,
      },
    },
  };
};
