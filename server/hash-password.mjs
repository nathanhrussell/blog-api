import bcrypt from "bcrypt";

const password = "@Balestrieri14"; //

const hash = await bcrypt.hash(password, 10);
console.log("Hashed password:", hash);
