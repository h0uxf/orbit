// Thin re-export seam: the actual scripted dialogue lives in @orbit/shared
// (ported verbatim from the design's dj-host.jsx) so it can be unit-tested
// and shared without an HTTP round trip. When a future LLM replaces the
// templates, only this file's internals should need to change — narrateEvent
// and replyToChat's signatures are the contract the routes depend on.
export { narrateEvent, replyToChat } from '@orbit/shared';
export type { DjChatContext, DjChatResult, DjEvent, DjEventPayload } from '@orbit/shared';
