import INote from "./interfaces/INote";

const dummyNote = {
  id: "test",
  text: "this is a test note",
  created: new Date(),
  tags: ["test"]
};

/**
 * TODO: implementation
 * Add notes to the notes table in the database
 *
 * @param {INote} note
 * @returns {INote}
 */
async function addNote(note: INote): Promise<INote> {
  return dummyNote;
}

/**
 * TODO: implementation
 * Returns all the notes authored on a specific day
 *
 * @param {Date} date
 * @returns {INote[]}
 */
async function getNotesOnDay(date: Date): Promise<INote[]> {
  return [dummyNote];
}

/**
 * TODO: implementation
 * Generates a file with all the notes authored on a specific day
 *
 * @param {Date} date
 */
function generateNotesForDay(date: Date): void {}

export { generateNotesForDay, getNotesOnDay, addNote };
