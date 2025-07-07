```bash
npx sequelize-xtra-cli -h
```
sequelize-xtra-cli [V: 1.0.0]  [Node: 22.14.0 ]

Usage: sequelize-xtra-cli [command] [options]

A Power packed next gen cli for sequelize ORM

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:

| commands             | description                             |
| ------------------- | --------------------------------------- |
| init:db [options]   | Initializes database configuration file |
| init:model          | Initializes model folder                |
| model [options]     | Generate a Sequelize model              |
| migration [options] | Generates Migration file for the model  |
| help [command]      | display help for command                |




```bash
npx sequelize-xtra-cli init:db -h
```

Usage: sequelize-xtra-cli init:db [options]

Initializes database configuration file

Options:

| options            | description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| -e, --envs [items] | Specify DB envs you needed as comma separated (default: ["local","dev","prod"]) |
| -f, --force        | Forcefully recreates the database configuration                                 |
| -h, --help         | display help for command                                                        |

```bash
npx sequelize-xtra-cli model -h
```

Usage: sequelize-xtra-cli model [options]

Generate a Sequelize model

Options:

| options                                              | dsecription                                                                                                                                      |
| ---------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| --mn, --model-name <model-name>                      | Define Model Name                                                                                                                                |
| --tn, --table-name <table-name>                      | Define Table Name                                                                                                                                |
| -a, --attributes <attributes>                        | Define model attributes as comma-separated                                                                                                       |
| -p, --primary [field]                                | Set primary key (default: "id")                                                                                                                  |
| --omit-id                                            | Omit id column from the model (default: false)                                                                                                   |
| -i, --index [fields]                                 | Define indexed fields as comma-separated                                                                                                         |
| --fn, --foreign [fields]                             | Define foreign keys in format `field1:references{table,column}-field2:references{table2,column2} ` as hyphen separated for multiple foreign keys |
| -u, --unique [fields]                                | Define unique constraints as comma-separated fields                                                                                              |
| --cu, --combo-unique [field1,field2],[field3,field4] | Define composite unique constraints comma-separated combos                                                                                       |
| --soft-delete                                        | Enable soft delete, adds deletedAt column (default: false)                                                                                       |
| -f, --force                                          | Forcefully recreates the Model file                                                                                                              |
| -t, --timestamps [format]                            | Enable timestamps (camel or snake) (choices: false,"camel", "snake", default: false)                                                             |
| -h, --help                                           | display help for command                                                                                                                         |

```bash
npx sequelize-xtra-cli migration -h
```

Usage: sequelize-xtra-cli migration [options]

Generates Migration file for the model

Options:

| options                         | description                       |
| ------------------------------- | --------------------------------- |
| --mp, --model-path [model-path] | Define path of model to refer to  |
| --fn, --file-name [file-name]   | Define name of the migration file |
| -h, --help                      | display help for command          |