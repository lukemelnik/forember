# Forember App

Forember is a memory enhancing app that uses spaced repetition and active recall to lock in important details forever.

## Tech Stack: React, NextJS, Tailwind, Supabase, Shadcn, OpenAI

## How it works:

1. You're reading an amazing book and taking notes about all the lifechanging things your learning...but by next week they'll just be a forgotten fragment in the labrynth of your Notion folder.

2. Instead, this time you upload your note to Forember. Our tuned AI takes your note and transforms it into the perfect set of questions to test your knowledge.

3. Now what? Enter our spaced repetition algorithm. To make things stick you need to _actively_ review them at increasing intervals until they become a part of the fabric of your being.

4. Each new peice of information gets put into a queue. You review it on the first day, if you get the question right then the interval increases to 2, 3, 4...up to 30 days after which it's been solidified in your memory. BUT - if you get the question wrong at one of the later intervals then the piece of information drops back to the beginning of the queue.

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

7. Great illustration of how objects are not equivalent (i.e. their reference locations are never the same even if internals are). I needed to filter the dates to only show the user the ones they need to practice today, critical to convert to timestamp with .getTime() :

```js
const filteredFragments = fragments.filter((fragment) => {
  const fragmentNextShowDay = startOfDay(fragment.next_show_date);
  const tomorrow = startOfDay(addDays(new Date(), 1));
  console.log(fragment.question, fragmentNextShowDay);

  console.log("tomorrow: ", tomorrow);

  return fragmentNextShowDay.getTime() === tomorrow.getTime();
});
```

8. SQL Primary Key vs Foreign Key - a primary key is the unique identifer for the row entry (in this case the session_id). The foreign key is what connects it to another table, in my case only allowing you to enter a session if a matching auth.id exists. I accidentially had the foreign key as the primary key, meaning no additional entries could be made because they would violate the rule that it has to be unique. IN SHORT - a primary key is always unique, a foreign key isnt'.

9. Funky stuff with trying to log user session data. I had endTime as a useState but the logSession was being ran with stale data (a theme!). In the end better to just pass the value to the function, plus using the 'isOpen' property eliminated another useState. _also make sure its endTime - startTime, not the other way around or it'll be negative_

```js
    <Dialog
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setStartTime(new Date());
        }
        if (!isOpen) {
          const endTime = new Date();
          logSession(endTime);
        }
      }}
    >
```

10. Animating pseudo elements in tailwind: pretty straightforward, the tricky thing was that the animation didn't work till I put 'after:' before the duration.

```js
<Link
  className="relative after:absolute hover:after:bg-zinc-100 content-none after:left-0 after:w-[0%] hover:after:w-[100%] hover:after:top-7 hover:after:h-[3px] hover:text-zinc-100 after:duration-300 transition-all"
  href="/learn"
>
  Learn
</Link>
```

11. TIME THINGS (Date-fns library for the win):

- if you want to compare full days it's easiest to set the time to zero with startOfDay(Date)
- you can't compare date objects (because you're comparing their reference location) so you need to convert them to strings first.
- TIME ZONES: even if you set the time to zero, you still have to account for the difference in time zones.
- Toronto time has a UTC offset of 4 (in the spring vs 5 in the fall), meaning that the time for dates in Supabase appear 4 hours ahead (because it's stored with no offset, just reference to the timezone). Very confusing because sessions I know ocurred on May 8th were showing up as May 9th, but that's why you use `toLocaleDateString()` where it'll apply the offset.

12. Classic stuff but you have to parse the req with data = req.json() before you can access the req.body! I had a problem where I was getting either nothing, or partial responses from openAI and it's because it was getting none, or pieces of the readable stream from the request.

13. Map for the win: I implemented editing for AI generated fragments. I was filtering out the edited fragment then adding it back to the rest of the array, but that meant that the visible fragment in the carousel changed because I'd changed the order in the array. Better to map and replace in the same location:

```js
  function saveFragment(fragment: Fragment) {
    const newFragments = fragments.map((f) =>
      f.id === fragment.id ? fragment : f
    );
    setFragments(newFragments);
  }
```

14. Errors from API fetch: can't send an error object in an HTTP response but you can send an object with a message:

```js
if (!response.ok) {
  const errorData = await response.json();
  const error = errorData.error;
  throw new Error(error || "Failed to generate fragments. Please try again.");
}
```

Then on the api route you can set the error message like this:

```js
if (!notes) {
  return Response.json(
    { error: "Please enter notes before generating." },
    {
      status: 400,
    }
  );
}
```

15. JSON: Learned some cool things while fighting the openai api to send back the right format of information. I was telling it to return JSON, but ideally I wanted a JSON string, which I could then JSON.parse and turn into the expected array. Then added lots of checks to make sure it actually was an array and the shape was correct. LASTLY: in the prompt I had accidentally left out the quotes on the key in example object, which was creating a parsing error!

16. Product design / UI: I really want to improve on making apps incredibly intuitive to use. From the first feedback I got from other people I realized that it wasn't immediately obvious how to operate it, and simple changes like effective page titles can make a huge difference.

17. Better way to use svg's: add them as components, but make the width and height props so that it's easier to adjust the size in each location.
