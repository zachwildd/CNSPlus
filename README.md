# CNSPlus

[document the different packages, commands, etc.]

[what features are we going to build?]
[what features are already built?]

- api
- src/CNSPlus.Shared
- src/CNSPlus.Web
- src/CNSPlus.Web.Client

examples for inspiration
[] https://tavern-wenches.com/
	[] https://sarahfrisk.com/
		[] avatar maker - https://avatar-maker.sarahfrisk.com/
[] https://www.webtoons.com/en/drama/daytime-in-the-bunker/list?title_no=9842

v0.0.1: Basic CMS Prototype (SELF-HOSTED with static content)

[] what is the structure of the /content directory?
	what information is stored for characters (xml)?
	where are art assets stored?

## Content Schemas

```
<character>
  <id></id>
  <createdBy></createdBy>
  <universeId></universeId>
  <slug>kyshumu</slug>
  <name>Kyshumu</name>
  <artUrl></artUrl>
  <description></description>
  <createdAt></createdAt>
  <updatedAt></updatedAt>
</character>

<comic>
  <id>9b3e7a52-4c8d-4f16-bcae-3d5f7b9e1c84</id>
  <createdBy>4e2a9c11-7f5b-4d63-9a02-1f6c8b4e5d70</createdBy>
  <universeId>b1d3f7a4-2c8e-49a5-bc01-7e3a5d9f6b82</universeId>
  <seriesId>f8c4e2d6-3a5b-4f17-8d9c-0b6e2a7c4f93</seriesId>
  <positionInSeries>1</positionInSeries>
  <slug>comic-1</slug>
  <title>Comic 1</title>
  <imageUrl></imageUrl>
  <caption></caption>
  <publishedAt>2017-02-08T00:00:00Z</publishedAt>
  <createdAt>2017-02-01T00:00:00Z</createdAt>
  <updatedAt>2017-02-01T00:00:00Z</updatedAt>
</comic>

```

[] pages, components for the home page?
	take inspiration from tavern-wenches.com;
	the current version could be much better,
	uses PublicLayout.razor copied from Webcomic-plus/index.html;
	need links to [ characters page, each comic in the collection, blog ];
	promotional trailer that shows off the characters or something;
	the comic's name;

[] page, components for comic reader? /comic/[comic-slug]
	what affordances are there to switch pages?
	how are panels rendered? 
	how many are present on the page?
	where are the image assets for panels stored?

[] page, components for character profile? /characters/[character-slug]
	design the character page;
	data model for characters; (where in content);
	how are we going to store art assets for characters? 
	show character in a range of poses;
		what are the elements of a character sheet?

[] what is the structure of the content folder?
	see WebcomicX/content as an example, could copy

v1.0.0: CMS Platform (HOSTED API)

[] need to setup a simple sqlite database,
	ensure the api can connect to it,
	and instructions for running locally are simple,
	need to provide a script for seeding;

[] what components are used to render /comic/id;
	based on this determine what we need to build for actually reading the comic; 
	and figure out what data the api needs to provide for these pages; 
	where are we going to store image assets;
	where are image assets stored locally/prod;

[] character page;
	implement this in the database, with simple api operations; 
	add seed script for initial set of cyber.beast characters; 