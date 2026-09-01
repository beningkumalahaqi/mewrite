# PRD — Personal Writing Website

## 1. Overview
Name: MeWrite
A minimal personal writing website where a single author can write, edit, publish, and unpublish writings.

The public website is a collection of the author's published writings. The private **Desk** is the authenticated writing workspace.

The product intentionally avoids typical CMS complexity. It is a personal tool with one author, simple content management, and a strong editorial/artistic frontend.

## 2. Goals

* Provide a frictionless place to write.
* Publish writings as a beautiful public archive.
* Support rich-text writing.
* Allow writings to be published or unpublished.
* Maintain universal author information used across the public website.
* Create a distinctive writer/editorial visual identity.
* Keep implementation and data model simple.

## 3. Non-Goals

The MVP will NOT include:

* Multiple authors.
* User registration.
* Comments.
* Likes/reactions.
* Social following.
* Categories.
* Tags.
* Search.
* Analytics.
* Newsletter/subscriptions.
* Draft collaboration.
* Version history.
* Media library.
* Complex CMS workflows.
* AI writing assistance.

## 4. Terminology

| Term        | Meaning                                                               |
| ----------- | --------------------------------------------------------------------- |
| Writing     | A piece of content written by the author                              |
| Desk        | Private authenticated area where writings are managed                 |
| Author      | Universal profile information displayed throughout the public website |
| Published   | A writing visible publicly                                            |
| Unpublished | A writing visible only inside the Desk                                |

## 5. Core Features

### 5.1 Authentication

The author must authenticate before accessing the Desk.

Requirements:

* Login with email and password.
* Only one author/account is required.
* No public registration.
* Unauthenticated users cannot access Desk pages or writing management actions.
* Authenticated users can log out.

### 5.2 Writing Management

The author can create a writing containing:

* Date — required.
* Title — optional.
* Content — required.
* Published state.

The author can:

* Create a writing.
* Edit a writing.
* Delete a writing.
* Publish a writing.
* Unpublish a writing.

### 5.3 Writing Status

Each writing has two states:

* `DRAFT` / unpublished
* `PUBLISHED`

Unpublished writings:

* Are visible in the Desk.
* Are not accessible through public pages.
* Must not appear in the public writing archive.

Published writings:

* Appear in the public archive.
* Have a public detail page.
* Are accessible through their public URL.

### 5.4 Rich Text Editor

The writing editor provides basic rich-text functionality.

MVP formatting:

* Paragraphs.
* Headings.
* Bold.
* Italic.
* Strikethrough.
* Ordered list.
* Unordered list.
* Blockquote.
* Links.
* Inline code/code block if supported cleanly by the selected editor.

The editor should prioritize writing comfort rather than exposing every possible formatting feature.

### 5.5 Public Writing Archive

The homepage acts as the author's writing archive.

It should:

* Show only published writings.
* Sort writings newest first.
* Display date.
* Display title when a title exists.
* Support writings without titles gracefully.
* Link each writing to its public detail page.

The page should feel like an editorial index rather than a blog dashboard.

### 5.6 Public Writing Page

Each published writing has a dedicated public page.

It should:

* Display the writing date.
* Display the title when available.
* Render rich-text content.
* Display universal author information.
* Provide navigation back to the writing archive.
* Maintain a highly readable reading width.
* Preserve the visual character of the editor.

Unpublished writings must return a not-found response when accessed publicly.

### 5.7 Author Settings

The author has one universal author profile.

Fields:

* Author name — required.
* Short bio — optional.
* Profile image — optional.

The settings are global rather than per-writing.

Changes to the Author settings automatically affect all public pages using the author information.

### 5.8 Desk

The Desk is the private content management area.

The writing list should display:

* Title or untitled indicator.
* Date.
* Publication status.
* Last updated timestamp.
* Edit action.

Primary actions:

* New writing.
* Edit.
* Delete.
* Publish/unpublish.

The Desk should remain visually aligned with the public website while being optimized for productivity.

## 6. User Flows

### Create Writing

1. Author logs into Desk.
2. Selects `New Writing`.
3. Enters date.
4. Optionally enters title.
5. Writes content using the RTE.
6. Saves the writing.
7. Writing remains unpublished unless explicitly published.

### Publish Writing

1. Author opens an unpublished writing.
2. Selects `Publish`.
3. System changes its status to published.
4. Writing becomes publicly accessible.

### Unpublish Writing

1. Author opens a published writing.
2. Selects `Unpublish`.
3. System changes its status to unpublished.
4. Writing immediately disappears from the public archive and public URL.

### Update Author

1. Author opens Desk → Author Settings.
2. Updates name, bio, or profile image.
3. Saves changes.
4. Public pages use the new information automatically.

## 7. Pages

### Public

* `/` — Writing archive
* `/writings/[slug]` — Individual writing

### Private

* `/login` — Authentication
* `/desk` — Writing management
* `/desk/writings/new` — New writing
* `/desk/writings/[id]` — Edit writing
* `/desk/settings` — Author settings

## 8. Functional Requirements

### FR-01 Authentication

Only authenticated users may access `/desk/*`.

### FR-02 Create

The author can create a writing with a date and content.

### FR-03 Optional Title

A writing may exist without a title.

### FR-04 Rich Text

Writing content supports rich-text formatting.

### FR-05 Editing

The author can modify existing writings.

### FR-06 Delete

The author can permanently delete a writing.

### FR-07 Publishing

The author can publish an unpublished writing.

### FR-08 Unpublishing

The author can unpublish a published writing.

### FR-09 Public Visibility

Only published writings are publicly accessible.

### FR-10 Chronological Archive

The public archive sorts published writings by date, newest first.

### FR-11 Author Settings

The author can update global author information.

### FR-12 Global Author

Author information is reused across public writing pages.

## 9. Non-Functional Requirements

### Performance

* Server-render public writing pages where appropriate.
* Avoid unnecessary client-side JavaScript.
* Public pages should load quickly.
* Optimize profile images.

### Accessibility

* Semantic HTML.
* Keyboard-accessible controls.
* Proper form labels.
* Sufficient color contrast.
* Visible focus states.
* Accessible rich-text editor controls.

### Responsive Design

The website must work well on:

* Desktop.
* Tablet.
* Mobile.

The reading experience on mobile is particularly important.

### Security

* Protect all Desk routes.
* Protect writing mutations server-side.
* Never rely solely on client-side authorization.
* Passwords must be securely hashed.
* Validate all submitted data server-side.

## 10. MVP Acceptance Criteria

The MVP is complete when:

* The author can log in.
* The author can create a writing.
* The author can leave the title empty.
* The author can enter rich-text content.
* The author can save a writing.
* The author can edit a writing.
* The author can delete a writing.
* The author can publish and unpublish writings.
* Published writings appear on the public archive.
* Unpublished writings do not appear publicly.
* Published writings have individual public pages.
* Author settings can be updated.
* Updated author information appears globally.
* The website is responsive.
* The public interface feels like a personal writer's website rather than a generic CMS.
* No unnecessary CMS features are introduced.

## 11. Future Considerations

Potential future features, intentionally excluded from MVP:

* Tags.
* Search.
* Writing series.
* Reading time.
* Cover images.
* Markdown import/export.
* Image embedding.
* Scheduled publishing.
* RSS.
* Sitemap/SEO enhancements.
* Custom domains.
* Writing statistics.
* Multiple authors.
