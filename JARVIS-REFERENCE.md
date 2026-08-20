# JARVIS Reference — Portfolio

This file is a project-side pointer to the shared JARVIS contract. It is not a second wiki and must not copy live portfolio architecture, plans, or phase state.

## Source of truth

- Shared knowledge wiki: `D:\JARVIS\`
- Wiki contract: read `D:\JARVIS\purpose.md`, then `D:\JARVIS\schema.md`, then `D:\JARVIS\wiki\index.md`.
- Portfolio live truth: `D:\portfolio\CLAUDE.md` and `D:\portfolio\docs\plans\`.
- Portfolio provenance pointer: `D:\JARVIS\wiki\projects\portfolio.md`.

## Session contract

1. Before deciding or writing a reusable concept/pattern, query/read the relevant JARVIS index and source page. Open only relevant pages; do not load the whole wiki.
2. After a real test, build, migration, operational run, or system observation, write first-person evidence only to `D:\JARVIS\raw\YYYY-MM-DD-retro-<slug>.md`. Record what happened, cost, corpus/environment/scope/run count, and what will be done differently.
3. Run `bash D:/JARVIS/tools/lint.sh --self-check` after writing evidence. Fix errors before ending the session.
4. Do not write directly to `D:\JARVIS\wiki\` from the portfolio session. A separate JARVIS curation session distills raw evidence into concepts, patterns, projects, or synthesis pages.
5. Keep portfolio laws, architecture, implementation notes, and plans in `D:\portfolio`; JARVIS receives only reusable knowledge and pointer pages.
6. Any JARVIS tools/schema/check change must use commit format `<op>: <name>` and add a matching `wiki/log.md` entry. Performance measurements must state corpus, environment, scope, and run count.

## Related pointer

Read `D:\JARVIS\wiki\projects\portfolio.md` when this task concerns the portfolio/JARVIS relationship.
