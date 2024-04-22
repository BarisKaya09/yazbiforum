import chalk from "chalk";
import bcrypt from "bcrypt";

// kırmızı arka planlı yeşil renkli yazı yazar
export const bgRedAndGreenText = (text: string): string => chalk.bgRed(chalk.green(text));

// // mongo client döndürür
// export const mongoClient = (uri: string, opt?: MongoClientOptions): MongoClient => new MongoClient(uri, opt);

// verilen şifreyi encrypted hale getirir bu sayede kullanıcıların
//şifrelerininin güvenli bir şekilde tutulmasını sağlar
export const hashPassword = async (password: string, saltRounds: number): Promise<string> => await bcrypt.hash(password, saltRounds);

// kullanıcının gönderdiği şifrenin encrypted şifre ile eşleşiyorsa true aksi taktirde false döndürür
export const comparePassword = async (password: string, hash: string): Promise<boolean> => await bcrypt.compare(password, hash);
