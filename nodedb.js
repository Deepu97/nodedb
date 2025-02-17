let max=0;
const express=require('express');
const file=require('fs').promises;
const cors=require('cors');
const app=express();
// app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.post('/',(req,res)=>{
    const body=req.body;
    console.log(body);
    console.log(body.name);
    const data=body.name;
    const result=execute(data);
 console.log(result);
 
    res.end();
    // const data=execute(body);
    // res.send(data)
    // res.end();
    
})
app.listen(3000);
function execute(query) {
    const tokens = query.trim().split(/\s+/);
    const command = tokens[0].toUpperCase();

    switch (command) {
        case "CREATE": return createTable(tokens);
        case "INSERT": return insertInto(tokens);
        case "SELECT": return selectFrom(tokens);
        case "UPDATE": return updateTable(tokens);
        case "DELETE": return deleteFrom(tokens);
        case "JOIN": return   joinTables(tokens);
        case "ORDER": return  orderBy(tokens);
        case "LIMIT": return limitResults(tokens);
        default: throw new Error("Invalid SQL command");
    }
}
function createTable(tokens) {
    const tableName = tokens[2];
    // const arr=[{}];
    // file.write('exm.json',arr,(err)=>{
    //     console.log(err);
        
    // })

    // if (db[tableName]) {
    //     throw new Error(`Table '${tableName}' already exists`);
    // }

    // db[tableName] = [];
    // this.saveDB(db);
    return `Table '${tableName}' created successfully`;
}
async function insertInto(tokens) {
    const tableName = tokens[2];
   

    // if (!db[tableName]) {
    //     throw new Error(`Table '${tableName}' does not exist`);
    // }

    const columns = tokens.slice(3, tokens.indexOf("VALUES")).join("").replace(/[()]/g, "").split(",");
    console.log(columns);
    const values = tokens.slice(tokens.indexOf("VALUES") + 1).join("").replace(/[()]/g, "").split(",");
    console.log(values);

    let row = {};
    columns.forEach((col, i) => row[col.trim()] = values[i].trim().replace(/['"]/g, ""));
    row.id=max;
    max++;
    const jsonData = JSON.stringify(row, null, 2);
    file.appendFile('exm.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File written successfully');
        }
      });
   return row;

    // return `Row inserted into '${tableName}' successfully`;
}
function selectFrom(tokens) {
    const tableName = tokens[3];
    
    
                            
    if (!db[tableName]) {
        throw new Error(`Table '${tableName}' does not exist`);
    }

    let result = db[tableName];
    

    // if (tokens.includes("ORDER")) {
    //     result = this.orderBy(tokens, result);
    // }

    // if (tokens.includes("LIMIT")) {
    //     result = this.limitResults(tokens, result);
    // }

    return {result,tableName};
}
function updateTable(tokens) {
    const tableName = tokens[1];
   
    
    if (!db[tableName]) {
        throw new Error(`Table '${tableName}' does not exist`);
    }
    
    const setIndex = tokens.indexOf("SET");
    const whereIndex = tokens.indexOf("WHERE");
    const updates = tokens.slice(setIndex + 1, whereIndex).join("").split(",");
    const conditions = tokens.slice(whereIndex + 1).join("").split("=");
    
    db[tableName].forEach(row => {
        if (row[conditions[0].trim()] == conditions[1].trim()) {
            updates.forEach(update => {
                const [col, value] = update.split("=");
                row[col.trim()] = value.trim().replace(/['"]/g, "");
            });
        }
    });
    
   
    return `Table '${tableName}' updated successfully`;
}
function deleteFrom(tokens){
    const tableName = tokens[2];
    

    if (!db[tableName]) {
        throw new Error(`Table '${tableName}' does not exist`);
    }

    const conditions = tokens.slice(tokens.indexOf("WHERE") + 1).join("").split("=");
    db[tableName] = db[tableName].filter(row => row[conditions[0].trim()] != conditions[1].trim());
  
    return `Rows deleted from '${tableName}' successfully`;
}
