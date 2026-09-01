/* ═══════════════════════════════════════════════
   APP — localStorage-backed state for HaqiZ
   ═══════════════════════════════════════════════ */

const App = (() => {
  const KEYS = {
    writings: 'hagiz_writings',
    author: 'hagiz_author',
    session: 'hagiz_session',
  };

  // ─── Seed Data ───

  const SEED_AUTHOR = {
    name: 'HaqiZ',
    bio: 'Writer. Reader. Occasionally both at the same time.',
    avatar: null,
  };

  const SEED_WRITINGS = [
    {
      id: 'w1',
      title: 'On the Practice of Showing Up',
      content: '<p>There is a particular kind of courage in the daily act of sitting down to write. Not the grand courage of war or revolution, but the quiet, persistent kind — the kind that says, <em>I will be here again tomorrow.</em></p><p>I have been writing, on and off, for fifteen years. The off periods are always longer than the on ones. But something changed when I stopped waiting for inspiration and started treating writing like breathing — not optional, not dramatic, just necessary.</p><p>The blank page is not your enemy. It is not a test. It is a field, and you are invited to walk across it in any direction you choose. Some days you will find something worth keeping. Most days you will not. Both outcomes are the practice.</p><p>I write about the things that linger — conversations that ended wrong, places I can still smell, the particular quality of light at four in the afternoon in October. I write because I cannot stop noticing, and if I do not put the noticing somewhere, it piles up and makes me heavy.</p><p>This is my desk. These are my papers. You are welcome to read them.</p>',
      date: '2026-08-28',
      published: true,
    },
    {
      id: 'w2',
      title: 'Letters to a Younger Self',
      content: '<p>Dear twenty-year-old me,</p><p>You are worried about the wrong things. You think your worth is measured by productivity, by output, by the visible evidence of effort. It is not. It is measured by the depth of your attention — to people, to places, to the small textures of a life being lived.</p><p>Stop comparing your draft to someone else\'s published work. That is like comparing your breakfast to someone else\'s dinner. Different meals, different hungers, different times of day.</p><p>Write badly. Write with abandon. Write the sentences that embarrass you, because those are usually the truest ones. The polished ones are often the most dishonest.</p><p>And please — stop apologizing for taking up space on the page.</p>',
      date: '2026-08-15',
      published: true,
    },
    {
      id: 'w3',
      title: 'The Geography of Memory',
      content: '<p>Every city I have lived in exists in my memory as a sensation, not a map. Paris is the smell of rain on stone. Berlin is the sound of a bicycle chain on a quiet street. Tokyo is the feeling of being politely, beautifully invisible.</p><p>I have been thinking about how memory works like a photographer who never shows you the whole frame — just the edges, the light, the things just out of focus. We remember feelings more than facts, textures more than dates.</p><p>When I write about a place, I am not writing about geography. I am writing about the person I was when I was there. The self that existed only in that city, at that time, under that particular sky.</p><p>Maybe all writing is autobiography. Maybe every landscape is a self-portrait.</p>',
      date: '2026-07-30',
      published: true,
    },
    {
      id: 'w4',
      title: 'Why I Returned to Paper',
      content: '<p>For three years, I wrote everything on a screen. The words came faster, but they also left faster. I could not remember what I had written yesterday, could not feel the weight of a month\'s work in my hands.</p><p>So I went back to paper. Not entirely — I still type first drafts on occasion, still email, still live in the digital world. But my thinking, my real thinking, happens in notebooks now.</p><p>There is a cognitive difference between writing on paper and writing on screen. On paper, you cannot Command-Z your way to honesty. You have to live with the crossed-out word, the smudged thought, the sentence that went wrong and stayed wrong. And in that permanence, something honest emerges.</p><p>The notebook does not judge. It does not suggest auto-complete. It does not notification you out of a thought. It just waits, patiently, for the next word.</p>',
      date: '2026-07-12',
      published: true,
    },
    {
      id: 'w5',
      title: 'Small Mercies',
      content: '<p>The coffee was too hot and I burned my tongue. The train was four minutes late. The book I am reading has a protagonist I cannot stand.</p><p>And yet — the morning light through the kitchen window made the water in the glass look like liquid gold. A stranger held the door. I found a sentence in the book that made me stop and stare at the ceiling for a full minute.</p><p>Life is not made of the big moments. It is made of these — the small mercies, the tiny kindnesses, the unexpected beauty in ordinary things. I am trying, these days, to notice them before they pass.</p>',
      date: '2026-06-25',
      published: true,
    },
    {
      id: 'w6',
      title: 'The Sound of Silence in a Noisy World',
      content: '<p>We have forgotten what silence sounds like. Not the absence of noise — true silence, the kind you find in an empty room at midnight, or in a forest after rain. It has a texture, a presence, a weight.</p><p>I have been practicing silence. Five minutes in the morning before the phone lights up. Ten minutes on a walk without headphones. It is harder than it sounds. The mind, left alone, reaches for stimulation like a plant reaches for light.</p><p>But in the reaching, something interesting happens. Thoughts arrive that were too quiet to be heard over the noise. Ideas that needed stillness to form. Feelings that needed space to surface.</p><p>Silence is not empty. It is full of everything the noise was drowning out.</p>',
      date: '2026-06-10',
      published: true,
    },
    {
      id: 'w7',
      title: 'Recipes for a Life I Haven\'t Lived',
      content: '<p>I collect recipes the way other people collect stamps — not to use, but to dream. A recipe for bread from a village in Portugal. A recipe for tea from a shop in Kyoto that I visited once, briefly, in the rain.</p><p>Each recipe is a small portal into someone else\'s Tuesday afternoon. The act of making bread, the act of steeping tea — these are acts of faith in continuation, in tomorrow, in the idea that there will be someone to share this with.</p><p>I have never made the Portuguese bread. I have never replicated the Kyoto tea. But I have the recipes, and in having them, I carry those afternoons with me.</p><p>Some things are more valuable as possibility than as reality.</p>',
      date: '2026-05-22',
      published: true,
    },
    {
      id: 'w8',
      title: 'In Defense of Being Average',
      content: '<p>We live in an age that worships the exceptional. The ten-bagger, the overnight success, the viral moment. We celebrate the peaks and ignore the plains.</p><p>But most of life is lived on the plains. The Tuesday evenings, the commutes, the meals that are neither terrible nor memorable. And there is a quiet dignity in being average — in doing the thing not for the accolade but for the doing.</p><p>I am an average writer. I will never win the prizes or top the lists. But I write consistently, thoughtfully, with care. And that consistency — that showing up for the average — is its own kind of excellence.</p><p>The world needs its average people. The ones who keep the lights on, who show up, who do the work without expecting a medal. We are the bedrock, and bedrock does not need to shine.</p>',
      date: '2026-05-08',
      published: true,
    },
    {
      id: 'w9',
      title: 'An Inventory of Blue',
      content: '<p>The blue of a realized dream — vivid, almost too bright, the kind that makes you squint. The blue of a Tuesday afternoon, muted, reliable, there when you need it. The blue of grief, deep and oceanic, pulling you under if you let it.</p><p>I have been collecting blues. The exact shade of the Aegean at noon. The pale, uncertain blue of a winter sky just before snow. The electric blue of a notification on a dark screen.</p><p>Blue is the color of distance — emotional, geographical, temporal. We say we feel blue when we are far from happiness. The blues in music are about the space between what is and what could be.</p><p>If sadness has a color, it is not black. It is blue. And blue, for all its sorrow, is the most beautiful color in the world.</p>',
      date: '2026-04-18',
      published: true,
    },
    {
      id: 'w10',
      title: 'The Last Bookshop',
      content: '<p>There is a bookshop near my house that I am certain will not survive the year. It is too small, too quiet, too full of books no one is looking for. The owner is eighty-three and has been behind the counter since before I was born.</p><p>I go there not to buy — I buy online, like everyone else — but to stand in the presence of someone who has dedicated a life to a thing that is dying. There is something noble in that. Something human.</p><p>Last week, he recommended me a book. Not based on an algorithm or a bestseller list, but on the way I hold a book when I browse — the angle of my wrist, he said, told him what I needed. He was right.</p><p>I will miss this place when it is gone. I will miss the way he says "ah, yes" when I bring a book to the counter, as if he has been waiting for me to find exactly that one.</p>',
      date: '2026-04-02',
      published: true,
    },
    {
      id: 'w11',
      title: 'Learning to Read Again',
      content: '<p>I used to read a book a week. Now I read a paragraph and reach for my phone. The attention span I once had — the ability to live inside a story for hours — has atrophied like a muscle left unused.</p><p>So I am relearning. I started with short stories — Chekhov, Munro, Carver. Five to twenty pages. A complete world in a small space. I read them on paper, in a chair, with a timer set for thirty minutes. No phone. No music. Just the words.</p><p>It is excruciating. And beautiful. And slowly, slowly, the muscle is returning. Last night I read for an hour without stopping. It felt like remembering how to breathe after holding your breath for a long time.</p><p>We are not broken. We are just out of practice. And practice, it turns out, still works.</p>',
      date: '2026-03-15',
      published: true,
    },
    {
      id: 'w12',
      title: 'The Things We Carry in Our Pockets',
      content: '<p>A receipt from a café I no longer visit. A key to a door that has been changed. A stone I picked up on a beach three summers ago, smooth and grey, holding the cold of the Atlantic.</p><p>Our pockets are archives. Every object is a compressed story — a date, a place, a feeling, a person who is no longer standing next to us. We carry these things without thinking, and then one day we empty our pockets and find a small museum of a life.</p><p>I keep a particular button in my desk drawer. It fell off a coat I loved, the winter I lived in Edinburgh. I will never sew it back on. The coat is gone. The button remains, a tiny monument to a season of my life that was cold and bright and full of walking.</p>',
      date: '2026-03-01',
      published: true,
    },
    {
      id: 'w13',
      title: 'On Not Having a Grand Plan',
      content: '<p>Everyone seems to have a plan. A five-year vision, a mission statement, a roadmap. I have a notebook with half-finished sentences and a vague intention to write more.</p><p>I used to feel embarrassed by this. The culture of intentionality — of setting goals and crushing them — made my meandering feel like failure. But I have come to see the meandering as its own kind of plan. A plan to be surprised. A plan to follow curiosity instead of a compass.</p><p>The best things in my life have happened without planning. The city I live in. The work I do. The person I love. All accidents, all better than anything I could have engineered.</p><p>So I am done with grand plans. I will continue to show up, to write, to notice, and to follow whatever catches my eye. The path will reveal itself, or it won\'t. Either way, I will have been paying attention.</p>',
      date: '2026-02-14',
      published: true,
    },
    {
      id: 'w14',
      title: 'A Brief History of My Hands',
      content: '<p>My hands have held books, keyboards, lovers, strangers\' umbrellas, a dying cat, a newborn niece, clay on a wheel, a pen at three in the morning. They have been useful, and they have been still.</p><p>There is a story in the hands. The scar on my left thumb from a kitchen knife in 2014. The callus on my right middle finger from years of writing. The way my fingers curl when I sleep, as if still holding something.</p><p>I watch my hands when I type. They move with a confidence that surprises me. They know the shape of the words before my mind has finished forming them. The body remembers what the mind forgets.</p><p>Someday these hands will stop. Until then, they will continue to hold, to make, to reach. It is what hands are for.</p>',
      date: '2026-01-28',
      published: true,
    },
    {
      id: 'w15',
      title: 'The Art of the Unsent Letter',
      content: '<p>I have a drawer full of letters I never sent. To friends who drifted, to employers who disappointed, to a version of myself I was trying to reach. They are the truest things I have ever written, and they will never be read by anyone.</p><p>There is a freedom in writing without an audience. No performance, no expectation, no fear of misunderstanding. Just the pure act of putting one thought after another, knowing that the only judge is the page itself.</p><p>The unsent letter is a form of self-dialogue. It is the conversation you need to have but cannot, the words you need to say but have no one to say them to. Writing them down is enough. The act of writing is the act of saying, even if no one hears.</p><p>I will never send these letters. I will keep them, though, as evidence that I once felt something strongly enough to write it down.</p>',
      date: '2026-01-10',
      published: true,
    },
    {
      id: 'w16',
      title: 'What the Rain Taught Me',
      content: '<p>It rained for eleven days straight. The kind of rain that does not storm or rage but simply persists, a quiet grey presence that settles over everything like a blanket.</p><p>On the fourth day, I stopped waiting for it to end and started living inside it. I walked without an umbrella. I left the window open. I let the sound of it become the soundtrack of my days.</p><p>Rain teaches patience. It teaches that not everything needs to be solved or escaped. Sometimes you just need to be wet, to be cold, to be inconvenienced, and to carry on anyway.</p><p>On the twelfth day, the sun came out and the whole world smelled like renewal. But I missed the rain already. I had grown accustomed to its company.</p>',
      date: '2025-12-20',
      published: true,
    },
    {
      id: 'w17',
      title: 'In Praise of the Marginal',
      content: '<p>I have always been drawn to the margins — of books, of conversations, of life. The margin is where the real thinking happens. The main text is the performance; the margin is the response.</p><p>My books are full of marginalia. Underlines, question marks, exclamation points, tiny drawings, half-formed arguments with the author. The margins are my conversation with the text, a dialogue across time and space.</p><p>We are taught to value the center — the headline, the main character, the primary argument. But the margins are where the interesting stuff lives. The footnotes, the asides, the contradictions, the questions that the main text is too polite to ask.</p><p>I want to live in the margins. I want to be the footnote, the asterisk, the whispered aside. The center is too loud, too certain, too clean.</p>',
      date: '2025-12-05',
      published: true,
    },
    {
      id: 'w18',
      title: 'A Taxonomy of Silence',
      content: '<p>There is the silence of a library, full of contained energy. The silence of a church, heavy with unspoken prayers. The silence between two people who have said everything and have nothing left to say.</p><p>There is the silence of snow, which is not really silence at all but a muffling, a softening, a gentle hushing of the world\'s sharp edges. And there is the silence of 3 AM, which is the loudest silence there is — a silence that amplifies the heartbeat, the breath, the creak of a house settling into its foundations.</p><p>I have been cataloging silences the way a lepidopterist catalogs butterflies. Each one is different, each one carries its own information. Some are comfortable. Some are terrifying. All of them are honest.</p><p>Silence is the space where truth lives. Everything else is decoration.</p>',
      date: '2025-11-18',
      published: true,
    },
    {
      id: 'w19',
      title: 'The Weight of a Name',
      content: '<p>My name is three syllables. It takes 0.4 seconds to say. But it carries the weight of every introduction, every form I have ever filled out, every time someone has called my name across a room.</p><p>Names are strange things. We did not choose ours, yet we spend a lifetime building its meaning. My name means different things to different people — to my mother it is one thing, to my partner another, to strangers on the internet yet another.</p><p>I have been thinking about what it means to name yourself. To choose a name that fits, not the person you were born as, but the person you are becoming. Some people do this literally, changing their names. Others do it through their work, their art, their presence in the world.</p><p>I am still becoming my name. Some days it fits perfectly. Other days it feels like wearing someone else\'s coat.</p>',
      date: '2025-11-02',
      published: true,
    },
    {
      id: 'w20',
      title: 'The First Sentence',
      content: '<p>Every piece of writing begins with the same terror: the first sentence. It is the door you walk through, and once you are inside, the room is determined by its shape.</p><p>I have spent entire mornings on a single opening line. Not because I am perfectionist — I am not — but because the first sentence sets the tone, the rhythm, the contract between writer and reader. It says: this is the kind of story this is going to be.</p><p>The best first sentences are doors that open onto rooms larger than they appear. "Call me Ishmael." Three words, and suddenly you are on a boat, in the ocean, in a story about obsession and survival and the meaning of whiteness.</p><p>I am writing this as my first sentence today. It is not the best I have ever written. But it is honest, and it is here, and that is enough.</p>',
      date: '2025-10-15',
      published: true,
    },
    {
      id: 'w21',
      title: 'Notes from a Sleepless Night',
      content: '<p>3:17 AM. The clock glows green. The house is silent except for the hum of the refrigerator, which sounds, in the dark, like a mechanical prayer.</p><p>I am thinking about the letter I need to write. Not a real letter — the kind you send — but an internal letter, the kind you write to make sense of something. To whom, I am not sure. Perhaps to the night itself, which has given me this unwanted gift of wakefulness.</p><p>Insomnia is a strange companion. It strips away the social performance of daytime and leaves you with only yourself — raw, unedited, unable to hide behind busyness or politeness. In the dark, you are just a person, thinking thoughts you would never say aloud.</p><p>The sun will come up eventually. It always does. And when it does, I will fold these thoughts away like letters never sent, and begin the day as if I had slept.</p>',
      date: '2025-10-01',
      published: false,
    },
    {
      id: 'w22',
      title: 'The Color of Nostalgia',
      content: '<p>Nostalgia has a color. It is not the bright, saturated hue of the original memory but something softer — a washed-out version, like a photograph left in the sun. The edges are blurred. The details are gone. What remains is the feeling, hovering like dust in a shaft of light.</p><p>I have been thinking about why we romanticize the past. Is it because we forget the pain and keep the beauty? Or is it because the past, by being past, becomes a story we tell ourselves — and stories always have a shape that real life lacks?</p><p>The nostalgia I feel for my childhood is not for the childhood itself — it was complicated, like all childhoods — but for the simplicity of being inside it, not yet aware that it would end.</p><p>We cannot go back. But we can visit, in memory, in writing, in the particular quality of afternoon light that reminds us of another afternoon, long ago, when we were someone else entirely.</p>',
      date: '2025-09-20',
      published: false,
    },
  ];

  // ─── Helpers ───

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function generateId() {
    return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function truncate(text, len) {
    if (text.length <= len) return text;
    return text.slice(0, len).replace(/\s+\S*$/, '') + '…';
  }

  // ─── Public API ───

  function init() {
    if (!load(KEYS.author, null)) {
      save(KEYS.author, SEED_AUTHOR);
    }
    if (!load(KEYS.writings, null)) {
      save(KEYS.writings, SEED_WRITINGS);
    }
    if (!load(KEYS.session, null)) {
      save(KEYS.session, { loggedIn: false });
    }
  }

  function getAuthor() {
    return load(KEYS.author, SEED_AUTHOR);
  }

  function saveAuthor(author) {
    save(KEYS.author, author);
  }

  function getSession() {
    return load(KEYS.session, { loggedIn: false });
  }

  function login(password) {
    if (password === 'haqiz') {
      save(KEYS.session, { loggedIn: true });
      return true;
    }
    return false;
  }

  function logout() {
    save(KEYS.session, { loggedIn: false });
  }

  function getWritings(publishedOnly) {
    const all = load(KEYS.writings, SEED_WRITINGS);
    if (publishedOnly) {
      return all.filter(w => w.published).sort((a, b) => b.date.localeCompare(a.date));
    }
    return all.sort((a, b) => b.date.localeCompare(a.date));
  }

  function getWriting(id) {
    const all = load(KEYS.writings, SEED_WRITINGS);
    return all.find(w => w.id === id) || null;
  }

  function createWriting(data) {
    const all = load(KEYS.writings, SEED_WRITINGS);
    const writing = {
      id: generateId(),
      title: data.title || '',
      content: data.content || '',
      date: data.date || new Date().toISOString().slice(0, 10),
      published: false,
    };
    all.unshift(writing);
    save(KEYS.writings, all);
    return writing;
  }

  function updateWriting(id, data) {
    const all = load(KEYS.writings, SEED_WRITINGS);
    const idx = all.findIndex(w => w.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    save(KEYS.writings, all);
    return all[idx];
  }

  function deleteWriting(id) {
    const all = load(KEYS.writings, SEED_WRITINGS);
    const filtered = all.filter(w => w.id !== id);
    save(KEYS.writings, filtered);
  }

  function togglePublish(id) {
    const all = load(KEYS.writings, SEED_WRITINGS);
    const idx = all.findIndex(w => w.id === id);
    if (idx === -1) return null;
    all[idx].published = !all[idx].published;
    save(KEYS.writings, all);
    return all[idx];
  }

  function checkAuth() {
    const session = getSession();
    if (!session.loggedIn) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  return {
    init,
    getAuthor,
    saveAuthor,
    getSession,
    login,
    logout,
    getWritings,
    getWriting,
    createWriting,
    updateWriting,
    deleteWriting,
    togglePublish,
    checkAuth,
    formatDate,
    formatDateShort,
    stripHtml,
    truncate,
    generateId,
  };
})();

App.init();
