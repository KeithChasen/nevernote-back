import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware
} from "type-graphql";
import { User } from "../entity/User";
import { isAuth } from "../helpers/isAuth";
import { Note } from "../entity/Note";
import { MyContext } from "./UserResolver";


@Resolver()
export class NoteResolver {
    @Query(() => [Note])
    @UseMiddleware(isAuth)
    async listNotes(@Ctx() ctx: MyContext) {
        return Note.find({ relations: { user: true } });
    }

    @Mutation(() => Note)
    @UseMiddleware(isAuth)
    async addNote(
        @Arg('title') title: string,
        @Arg('content') content: string,
        @Ctx() ctx: MyContext
    ) {
        try {
            const user = await User.findOne({ where: { id: ctx.tokenPayload?.userId } })
            if (!user)
                throw new Error('User not found');

            const newNote = await new Note();
            newNote.title = title;
            newNote.content = content;
            newNote.user = user;
            await newNote.save();
            return newNote;
        } catch (e) {
            console.error(e)
            throw new Error(e as string);
        }
    }

    @Mutation(() => Note)
    @UseMiddleware(isAuth)
    async updateNote(
        @Arg('title') title: string,
        @Arg('content') content: string,
        @Arg('noteId') noteId: string,
    ) {
        try {
            const note = await Note.findOne({
                where: { id: noteId },
                relations: { user: true }
            });
            if (!note)
                throw new Error('Note not found');

            note.title = title;
            note.content = content;
            await note.save();
            return note;
        } catch (e) {
            console.error(e)
            throw new Error(e as string);
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteNote(@Arg('noteId') noteId: string) {
        try {
            const note = await Note.findOne({
                where: { id: noteId },
                relations: { user: true }
            });
            if (!note)
                throw new Error('Note not found');

            await note.remove();
            return true;
        } catch (e) {
            console.error(e)
            throw new Error(e as string);
        }
    }
}
