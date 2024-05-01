#Forember App

Forember is a memory enhancing app that uses spaced repetition and active recall to lock in important details forever.

## Tech Stack: React, NextJS, Tailwind, Supabase, Shadcn, OpenAI

## How it works:

1. You're reading an amazing book and taking notes about all the lifechanging things your learning...but by next week they'll just be a forgotten fragment in the labrynth of your Notion folder.

2. Instead, this time you upload your note to Forember. Our tuned AI takes your note and transforms it into the perfect set of questions to test your knowledge.

3. Now what? Enter our spaced repetition algorithm. To make things stick you need to _actively_ review them at increasing intervals until they become a part of the fabric of your being.

4. Each new peice of information gets put into a queue. You review it on the first day, if you get the question right then the interval increases to 2, then 4, 8, then 16 days - after which it's been solidified. BUT - if you get the question wrong at one of the later intervals then the piece of information drops back to the beginning of the queue.

5. Then all you have to do is open the app and practice for 20 minutes a day. Without any effort you'll be retaining up to 85% more than with conventional note taking _need to find a real metric 🙂_ .

## Takeaways:

1. If you want to run other code on submission you can pass the formData into the action and add other lines. When using server action you can clear using a ref:

```js
  const [formState, action] = useFormState(createFragment, { errors: {} });

  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        action(formData);
        ref.current?.reset();
      }}
```

2. Anything involving data fetching has to be done asynchronously or the data won't be available (ie. if you're seeing data is undefined check that the function is async and you're awaiting the db call)
