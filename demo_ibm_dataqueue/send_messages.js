"use strict";

const odbc = require("odbc");
const connInfo = {
  connectionString: "DSN=" + process.env.DSN + ";UID=ZWAITE;PWD= + " process.env.PASSWORD + ";",
  connectionTimeout: 10,
  loginTimeout: 10,
};

async function pumpDataQueue() {
  const conn = await odbc.connect(connInfo);
  let counter = 0;

  try {
    while (true) {
      const sql = `CALL QSYS2.SEND_DATA_QUEUE(MESSAGE_DATA => 'Test #${counter}', DATA_QUEUE => 'DTA1', DATA_QUEUE_LIBRARY => 'ZWAITE1')`;
      const rs = await conn.query(sql);
      counter += 1;

      console.log(rs);
    }
  } catch (err) {
    console.error(`Error: ${err.stack}`);
  }
}

pumpDataQueue();
