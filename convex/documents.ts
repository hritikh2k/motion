import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingDocumet = await ctx.db.get(args.id);
    if (!existingDocumet) {
      throw new Error("Not found");
    }
    if (userId !== existingDocumet.userId) {
      throw new Error("Unauthorized");
    }
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }
    };
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return document;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);
    if (!existingDocuments) return new Error("Document not found");
    if (existingDocuments.userId !== userId) {
      return new Error("Not authorised");
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const childern = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of childern) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    if (existingDocuments.parentDocument) {
      const parent = await ctx.db.get(existingDocuments.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);
    return document;
  },
});

export const removeFile = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);
    if (!existingDocuments) return new Error("Document not found");
    if (existingDocuments.userId !== userId) {
      return new Error("Not authorised");
    }
    const documnt = await ctx.db.delete(args.id);
    return documnt;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const documents=await ctx.db.query('documents')
    .withIndex('by_user',(q)=>q.eq('userId',userId))
    .filter((q)=>q.eq(q.field("isArchived"),false),)
    .order("desc")
    .collect()
    return documents
  }})

  export const getById = query({
    args:{documentId:v.id("documents")
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      const document=await ctx.db.get(args.documentId);
      if(!document){
        throw new Error("Not found");
      }
      if(document.isPublished&&document.isArchived){
        return document;
      }
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject;
      if(document.userId!==userId){
        throw new Error("Unauthorise")
      }
    return document;
    }
  })

  export const update = mutation({
    args:{
      id:v.id('documents'),
      title:v.optional(v.string()),
      content:v.optional(v.string()),
      coverImage:v.optional(v.string()),
      icon:v.optional(v.string()),
      isPublished:v.optional(v.boolean())
    },
    handler: async (ctx,args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const userId = identity.subject;
      const {id,...rest}=args;
      const existingDocumet = await ctx.db.get(args.id);
      if (!existingDocumet) {
      throw new Error("Not found");
      }
      if(existingDocumet.userId!==userId){
        throw new Error("Unauthorised")
      }
      const document =await ctx.db.patch(args.id,{
        ...rest,
      })
      return document;
    }})