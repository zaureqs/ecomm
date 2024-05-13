/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// @ts-nocheck
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Function to read CSV file and return data in an array
async function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function seeddb(data) {
  for (let i = 0; i < data.length; i++) {
    try {
      const { Category } = data[i];
      await db.category.create({
        data: {
          name: Category,
        },
      });
    } catch (err) {
      console.log(err.message);
    }
  }
}

// Usage
const filePath = "./data.csv"; // Replace 'your_csv_file.csv' with the path to your CSV file

async function main() {
  try {
    const data = await readCSVFile(filePath);
    await seeddb(data);
    console.log("success");
  } catch (error) {
    console.error("Error reading CSV file:", error);
  }
}

void main();
