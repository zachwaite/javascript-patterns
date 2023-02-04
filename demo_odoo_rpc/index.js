// imports

import axios from "axios";


// utils

const config = () => {
  return {
    "host": process.env.ODOO_HOST,
    "port": parseInt(process.env.ODOO_PORT),
    "protocol": process.env.ODOO_PROTOCOL,
    "db": process.env.ODOO_DB,
    "login": process.env.ODOO_LOGIN,
    "password": process.env.ODOO_PASSWORD
  };
};


class OdooSession {
  constructor(host, port, db, username, password) {
    this.host = host;
    this.port = port;
    this.db = db;
    this.username = username;
    this.password = password;
    this.url = "http://" + this.host + ":" + this.port + "/jsonrpc";
    this.uid = 2;
  }

  async search(model, domain, call_id=null) {
    const _domain = domain || [];
    const params = {
      service: "object",
      method: "execute_kw",
      args: [this.db, this.uid, this.password, model, "search", [_domain]],
    };
    const rpcArgs = {
      jsonrpc: "2.0",
      method: "call",
      params: params,
      id: call_id || Math.floor(Math.random() * 100000),
      withCredentials: true,
    };
    const rs = await axios.post(this.url, rpcArgs);
    if (rs.data.error) {
      console.log(rs.data.error);
    } else {
      return rs.data.result;
    }
  }

  async create(model, vals, call_id=null) {
    const _vals = vals || {};
    const params = {
      service: "object",
      method: "execute_kw",
      args: [this.db, this.uid, this.password, model, "create", [_vals]],
    };
    const rpcArgs = {
      jsonrpc: "2.0",
      method: "call",
      params: params,
      id: call_id || Math.floor(Math.random() * 100000),
      withCredentials: true,
    };
    const rs = await axios.post(this.url, rpcArgs);
    if (rs.data.error) {
      console.log(rs.data.error);
    } else {
      return rs.data.result;
    }
  }

  async write(model, ids, vals, call_id=null) {
    const _ids = ids || [];
    const _vals = vals || {};
    const params = {
      service: "object",
      method: "execute_kw",
      args: [this.db, this.uid, this.password, model, "write", [_ids, _vals]],
    };
    const rpcArgs = {
      jsonrpc: "2.0",
      method: "call",
      params: params,
      id: call_id || Math.floor(Math.random() * 100000),
      withCredentials: true,
    };
    const rs = await axios.post(this.url, rpcArgs);
    if (rs.data.error) {
      console.log(rs.data.error);
    } else {
      return rs.data.result;
    }
  }
}

// main
(async () => {
  const c = config();
  const odoo = new OdooSession(c.host, c.port, c.db, c.login, c.password);
  let attendanceIds = await odoo.search("hr.attendance", [["employee_id", "=", 1], ["check_out", "=", false]]);
  if (!attendanceIds.length) {
    attendanceIds = await odoo.create("hr.attendance", {"employee_id": 1, "check_in": "2023-01-01 00:00:00"});
  } else {
    // pass
  }
  await odoo.write("hr.attendance", attendanceIds, {"check_out": "2023-01-06 00:00:00"});
})();
