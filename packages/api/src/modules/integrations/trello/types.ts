import { StringRegexOptions } from "joi";

export declare namespace TrelloAPI {
  export interface Emoji {}

  export interface DescData {
    emoji: Emoji;
  }

  export interface Trello {
    board: number;
    card: number;
  }

  export interface AttachmentsByType {
    trello: Trello;
  }

  export interface Badges {
    attachmentsByType: AttachmentsByType;
    location: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue?: any;
    comments: number;
    attachments: number;
    description: boolean;
    due: string;
    dueComplete: boolean;
    start?: any;
  }

  export interface Label {
    id: string;
    idBoard: string;
    name: string;
    color: string;
  }

  export interface Cover {
    idAttachment?: any;
    color?: any;
    idUploadedBackground?: any;
    size: string;
    brightness: string;
    idPlugin?: any;
  }

  export interface Card {
    id: string;
    checkItemStates?: unknown;
    closed: boolean;
    dateLastActivity: string;
    desc: string;
    descData: DescData;
    dueReminder: number;
    idBoard: string;
    idList: string;
    idMembersVoted: string[];
    idShort: number;
    idAttachmentCover?: unknown;
    idLabels: string[];
    manualCoverAttachment: boolean;
    name: string;
    pos: number;
    shortLink: string;
    isTemplate: boolean;
    cardRole?: unknown;
    badges: Badges;
    dueComplete: boolean;
    due: string;
    idChecklists: string[];
    idMembers: string[];
    labels: Label[];
    shortUrl: string;
    start?: unknown;
    subscribed: boolean;
    url: string;
    cover: Cover;
  }

  export interface Board {
    id: string;
    name: string;
    desc: string;
    idOrganization: string;
    prefs: {
      permissionLevel: "private" | "public" | "org";
    };
  }

  export interface List {
    id: string;
    name: string;
    closed: boolean;
    pos: number;
    idBoard: string;
    subscribed: boolean;
  }

  export interface ChecklistItem {
    idChecklist: string;
    state: "incomplete" | "complete";
    id: string;
    name: string;
    pos: number;
    due: string | null;
    idMember: null;
  }

  export interface Checklist {
    id: string;
    name: StringRegexOptions;
    idCard: string;
    pos: number;
    idBoard: string;
    checkItems: ChecklistItem[];
  }
}
