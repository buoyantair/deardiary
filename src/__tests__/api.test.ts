import ConfigurationManager, { IConfiguration } from "../config";
import { addNote } from '../api'
import INote from "../interfaces/INote";
import { CACHE_DATA_DIR_PATH } from ".";
import { Database } from "sqlite";

describe("API", () => {
  describe("addNote", () => {
    test("Should return the newly added note", async () => {
      const exampleInputNote: INote = {
        id: '2mdnx2',
        created: new Date(),
        text: 'I managed to get this thing running today!',
        tags: ["happy", "accomplishment"]
      }
      
      const result = await addNote(exampleInputNote)
      expect(result).toEqual(exampleInputNote)
    })

    test("Should add a note to the Notes table in the database", async () => {
      const exampleInputNote: INote = {
        id: '2mdnx2',
        created: new Date(),
        text: 'I managed to get this thing running today!',
        tags: ["happy", "accomplishment"]
      }

      try {
        const database: Database = await ConfigurationManager.getDatabase(CACHE_DATA_DIR_PATH);
      
        database.get('SELECT * FROM notes WHERE id=?', exampleInputNote.id, (err: Error, rows: Object) => {
          if (err) {
            throw err
          }

          console.log('Database stuff', rows)
        })
      } catch(e) {
        console.error(e)
      }

    })
  })
})