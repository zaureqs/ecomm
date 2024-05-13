import * as z from "zod";

const getSchema = z.object({
  page: z.number(),
});


const putSchema = z.object({id: z.number()});


export {getSchema, putSchema};