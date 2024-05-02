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

3. If a CRUD operation isn't working, check RLS 🙂

4. Cool lesson about useState: I was fetching from db then passing to a component, but useState doesn't run till after the dom is updated. That means the data was undefined when the component mounted. Had to add a loading state so that it re-renders when the data is avaiable:

```js
{
  fragments.length === 0 && <p>Loading...</p>;
}
{
  fragments.length > 0 && (
    <FlashCard
      fragment={fragments[questionNumber]}
      handleClick={nextQuestion}
    />
  );
}
```

5. Creating a user profile on signup: I wanted to store more user information (name, usage data etc). To automatically create a new profile for each user I had to use the SQL editor to create a function & trigger:

Function:

```sql
begin
  insert into public.profile (user_id) -- this one has to match the profile 'user_id' column
  values (new.id); -- this one has to match the auth 'id' column
  return new;
end;
```

Trigger:

```sql
create trigger create_profile_on_signup after insert on auth.users fore each row execute function create_profile_on_signup();
```

6. FINALLY A FIX FOR TOASTING WITH SERVER ACTIONS: The solution from my portfolio project was close but the useEffect needs to track formState instead. Now it ignores the useEffect on component load, then operates correctly for subsequent renders.

```js
export default function NewFragmentForm() {
  const [formState, action] = useFormState(createFragment, { errors: {} });
  const [firstRender, setFirstRender] = useState(true);

  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    if (Object.keys(formState.errors).length === 0) {
      toast("Fragment added successfully 🎉", { duration: 2000 });
      ref.current?.reset();
    } else {
      toast("Error adding the fragment 😢", {
        duration: 2000,
      });
    }
  }, [formState.errors]);
```

TODO:

- add function for changing the practice interval based on user feedback

- add toasts for getting question right/wrong (reminding them what interval it's been changed to)

- potentially move the delete function up to the quiz level and pass down by props so that it's removed visually right away (right now it doesn't change till you refresh and got through the quiz again)

- add category to fragments and have links in nav to create quizes for them specifically

- add animation to quiz (potentially make modal)

- add ai photo creation & storage for each new fragment

- style the whole app better &

- add openAI functionality

- add stripe & subscription stuff

```

```
