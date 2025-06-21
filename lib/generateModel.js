const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const { success, errored, info, warn } = require("./logHelpers");

const modelsDir = path.join(process.cwd(), 'models');

function checkAndInitializeModels() {
  const destinationModelIndexPath = path.join(modelsDir, 'index.js');
  const assetIndexPath = path.join(__dirname, "../assets/modelIndex.js");
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  if (!fs.existsSync(destinationModelIndexPath)) {

    fs.readFile(assetIndexPath, "utf8", (err, data) => {
      if (err) {
        errored("model index read error")
        errored(err);
        return;
      }
      fs.writeFile(destinationModelIndexPath, data, 'utf8', (writeErr) => {
        if (writeErr) {
          errored("model index write error")
          errored(writeErr);
          return;
        }
        success(`Initialized models directory with index.js`);
      })
    })
  }
}

const parseAttributes = (attributes, primary, index, foreign, unique, comboUnique) => {
  let fieldsString = "";
  let sparsedIndices = [];
  let sparsedUnique = [];
  let sparsedComboUnique = [];
  let sparsedComboBucket = {};
  let simpleComboUnique = [];
  let attributesOnly = attributes.split(",").map((fieldDef) => fieldDef.split(":")[0])

  //check whether related fields are valid

  if (!attributesOnly.includes(primary) && primary !== "id") {
    errored("Primary field is not defined in attributes")
    return;
  }

  let splitIndex = index.split(",")
  if (index && !splitIndex.every(el => attributesOnly.includes(el))) {
    errored("Some index fields are not defined in attributes")
    return;
  }
  let splitUnique = unique.split(",");
  if (unique && !splitUnique.every(el => attributesOnly.includes(el))) {
    errored("Some Unique keys are not defined in attributes")
    return;
  }

  let foreignKeyOnly = foreign.split("-").map((fieldDef) => fieldDef.split(":")[0])
  if (foreign && !foreignKeyOnly.every(el => attributesOnly.includes(el))) {
    errored("Some foreign keys are  not defined in attributes")
    return;
  }

  let comboKeysOnly = comboUnique.split("-").map((fieldSets) => fieldSets.split(","))
  if (comboUnique.length && !comboKeysOnly.flat().every(el => attributesOnly.includes(el))) {
    errored("Some Combo unique fields are not defined in attributes");
    return;
  }

  const processEnumertedTypes = (fieldType) => {
    fieldType = fieldType.replace("ENUM", "").replace("(", "").replace(")", "").split("-");
    fieldType = fieldType.map(el => isNaN(el) ? `"${el}"` : parseInt(el))
    return `ENUM(${fieldType.join(",")})`
  }

  fieldsString = attributes.split(",").map((attDef) => {
    let [fieldName, fieldType, notNull, defaultValue, validator] = attDef.split(":");
    fieldType = fieldType.toLowerCase().includes("enum") ? processEnumertedTypes(fieldType) : fieldType.toUpperCase()
    let currFieldString = `${fieldName}: {\n`;
    currFieldString += `\t\ttype: DataTypes.${fieldType},\n`;
    if (notNull === "notNull") {
      currFieldString += "\t\tallowNull: false,\n";
    }
    let fieldInComboIndex = notNull !== "notNull"
      ? comboKeysOnly.findIndex(
        (combo, currComboIndex) =>
          combo.includes(fieldName) &&
          !sparsedComboBucket[currComboIndex]?.every((el) =>
            combo.includes(el)
          )
      )
      : -1;
    if (fieldInComboIndex >= 0) {
      sparsedComboBucket = { ...sparsedComboBucket, [fieldInComboIndex]: comboKeysOnly[fieldInComboIndex] };
    }
    if (defaultValue) {
      currFieldString += `\t\tdefaultValue: ${defaultValue},\n`;
    }
    if (validator) {
      currFieldString += `\t\tvalidate:{\n\t\t${validator}: true\n\t\t},\n`;
    }
    if (primary === fieldName) {
      currFieldString += `\t\tprimaryKey: true,\n`;
    }
    if (splitIndex.includes(fieldName)) {
      currFieldString += `\t\tindex: true,\n`;
      if (notNull !== "notNull") {
        sparsedIndices.push(`\t{\n\t\tindex:true,\n\t\tfields:["${fieldName}"],\n\t\twhere: {\n\t\t\t${fieldName}:{ [Sequelize.Op.ne]: null },\n}\n\t\t},`);
      }
    }
    if (splitUnique.includes(fieldName)) {
      currFieldString += `\tunique: true,\n`;
      if (notNull !== "notNull") {
        sparsedUnique.push(`\t{\n\t\tunique:true,\n\t\tfields:["${fieldName}"],\n\t\twhere: {\n\t\t\t${fieldName}:{ [Sequelize.Op.ne]: null },\n}\n\t\t},`);
      }
    }
    if (foreignKeyOnly.includes(fieldName)) {
      let currRef = foreign.split("-").find(el => el.includes(fieldName))
      let [startIdx, endIdx] = [currRef.indexOf("{"), currRef.indexOf("}")];
      currRef = currRef.slice(startIdx + 1, endIdx);
      const [tableName, column] = currRef.split(",");
      currFieldString += `\treferences:{\t\tmodel:"${tableName}",\n\t\tkey:"${column}"\n\t}\n`
    }
    currFieldString += "\t}\n";
    return currFieldString;
  }).join(",\n");

  comboKeysOnly.forEach((combo, index) => {
    if (sparsedComboBucket[index]) {
      simpleComboUnique.push(`\t{unique: true,\n\t\tfields: [${combo}]\n\t},`)
    }
  });
  Object.entries(sparsedComboBucket).forEach(([keyIndex, combo]) => {
    const whereConditions = combo.map(field => {
      return `\t\t\t${field}: { [Sequelize.Op.ne]: null },\n`;
    }).join('');
    combo = combo.map(el => `"${el}"`).join(",")
    sparsedComboUnique.push(`\t{\n\tunique: true,\n\t\tfields: [${combo}],\n\t\twhere: {\n${whereConditions}\t\t}\n\t}`);
  });

  sparsedIndices = sparsedIndices.length ? `${sparsedIndices.join(",\n")}` : ""
  sparsedUnique = sparsedUnique.length ? `${sparsedUnique.join(",\n")}` : "";
  simpleComboUnique = simpleComboUnique.length ? `${simpleComboUnique.join(",\n")}` : "";
  sparsedComboUnique = sparsedComboUnique.length ? `${sparsedComboUnique.join(",\n")}` : ""

  return { fieldsString, sparsedIndices, sparsedUnique, sparsedComboUnique, simpleComboUnique };
}

// Helper function to generate the ID field
const generateIdField = (omitId, primary) => {
  if (omitId) return "";
  const isIdPrimary = primary === "id" ? "primaryKey: true" : "";
  return `"id": {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      ${isIdPrimary}
    },\n`;
};

// Helper function to generate timestamp fields
const generateTimeStampFields = (timestamps, softDelete) => {
  if (timestamps !== "snake") return "";
  let timeStampFields = `createdAt: "created_at", updatedAt: "updated_at",`;
  timeStampFields += softDelete ? `deletedAt: "deleted_at"` : "";
  return timeStampFields;
};

// Helper function to generate the model template
const generateModelTemplate = ({ modelName, tableName }, columnFields, indexes, timeStampAndFields, softDeleteField) => {

  return `"use strict"
      const { Model, Sequelize } = require("sequelize");
  
      module.exports = (sequelize, DataTypes) => {
        class ${modelName} extends Model {
          // Helper method for defining associations.
          static associate(models) {
            // define associations here
          }
        }
        ${modelName}.init({
          ${columnFields}
        }, {
          sequelize,
          tableName: "${tableName}",
          modelName: "${modelName}",
          underscored: true,
          ${indexes}
          ${timeStampAndFields}
          ${softDeleteField}
        });
        return ${modelName};
      };
    `;
};

const generateModel = async (options) => {

  try {
    checkAndInitializeModels();
    const { modelName, tableName, attributes, omitId, primary, index="", foreign="", unique="", comboUnique="", softDelete="", timestamps=false, force } = options;
  
    if (force) {
      info("[-f, --force] option provided, forcefully recreating the Model file");
    }
  
    const modelPath = path.join(modelsDir, modelName + ".js");
  
    if (fs.existsSync(modelPath) && !force) {
      warn("Such Model with the same name already exists");
      return;
    }
    const { fieldsString, sparsedIndices, sparsedUnique, simpleComboUnique, sparsedComboUnique } = parseAttributes(attributes, primary, index, foreign, unique, comboUnique);
    
    const idField = generateIdField(omitId, primary);
    const timeStampFields = generateTimeStampFields(timestamps, softDelete);
    const columnFields = idField + fieldsString;
    const combineAllIndexes = [sparsedIndices, sparsedUnique, simpleComboUnique, sparsedComboUnique].join("\n")
    const indexes = combineAllIndexes.trim().length ? `indexes: [${combineAllIndexes}],` : "";
    const timeStampAndFields = timestamps ? `${"\ntimestamps: true," + timeStampFields + " , "}` : ""
    const softDeleteField = softDelete ? "paranoid: true" : "";
    const modelTemplate = generateModelTemplate({ modelName, tableName }, columnFields, indexes, timeStampAndFields, softDeleteField);
    await prettier.format(modelTemplate, {parser: "babel"})
    .then((response)=>{
      fs.writeFileSync(modelPath, response);
      success(`Created the model ${modelName} at ${modelPath} successfully`);
    })
  } catch (error) {
    errored("Error while creating Model ",error.message,error.stack);
    return
  }
};

module.exports = generateModel;