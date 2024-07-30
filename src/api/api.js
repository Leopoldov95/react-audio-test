import axios from "axios";

const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxCULy_FxMQS0AoPo3j6heyGf7uQzNq2uIFmwv99O9bbilE27J9ISsQxssD5Tez13z1/exec";
const DB_ID = "1e0FAnXlf2XO9pyXfP4We2w5ogJlLR_3K8Q4SjZvsV74";

export const postAuth = async (token) => {
  console.log(token);

  const results = await fetch(BASE_URL, {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify({ token: token, sheetId: DB_ID }),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  });

  const data = await results.json();
  console.log("Response data:");
  console.log(data);
  return data;
};
