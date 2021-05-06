let neo4j = require("neo4j-driver");
// let { creds } = require("./../config/credentials");
let driver = neo4j.driver(
  process.env.NEO4J_DB,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD)
);

// exports.get_num_nodes = async function () {
//   let session = driver.session();
//   const num_nodes = await session
//     .run("MATCH (n) RETURN n", {})
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((err) => console.log(err));
//   session.close();
//   console.log("RESULT", !num_nodes ? 0 : num_nodes.records.length);
//   return !num_nodes ? 0 : num_nodes.records;
// };
// exports.create_user = async function (name) {
//   let session = driver.session();
//   let user = "No User Was Created";
//   try {
//     user = await session.run("MERGE (n:user {name: $id}) RETURN n", {
//       id: name,
//     });
//   } catch (err) {
//     console.error(err);
//     return user;
//   }
//   return user.records[0].get(0).properties.name;
// };

module.exports = {
  read: (cypher, params = {}, database = "neo4j") => {
    const session = driver.session({
      defaultAccessMode: neo4j.session.READ,
      database,
    });

    return session
      .run(cypher, params)
      .then((res) => {
        session.close();
        return res;
      })
      .catch((e) => {
        session.close();
        throw e;
      });
  },
  write: (cypher, params = {}, database = "neo4j") => {
    const session = driver.session({
      defaultAccessMode: neo4j.session.WRITE,
      database,
    });

    return session
      .run(cypher, params)
      .then((res) => {
        session.close();
        return res;
      })
      .catch((e) => {
        session.close();
        throw e;
      });
  },
};
