"use server";

import { tomorrow } from "@/lib/date-calculations";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export default async function resetTestAccount() {
  console.log("resetting test account");
  const sampleFragments = [
    {
      question: "What is the relationship between JavaScript and Java?",
      answer:
        "JavaScript and Java are distinct languages with different use cases, syntax, and execution environments, despite the similar names.",
    },
    {
      question:
        "What does it mean for functions to be first-class citizens in JavaScript?",
      answer:
        "In JavaScript, functions are first-class citizens, meaning they can be assigned to variables, passed as arguments to other functions, and returned from functions.",
    },
    {
      question: "How does JavaScript handle asynchronous operations?",
      answer:
        "JavaScript supports asynchronous operations through callbacks, promises, and the async/await syntax, allowing non-blocking operations.",
    },
    {
      question: "What is dynamic typing in JavaScript?",
      answer:
        "JavaScript is dynamically typed, meaning you don't need to declare variable types. Variables can hold any type of data and can change types during execution.",
    },
    {
      question: "What is a closure in JavaScript?",
      answer:
        "A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope. This allows for powerful patterns like data encapsulation and function factories.",
    },
    {
      question: "What does it mean that JavaScript is event-driven?",
      answer:
        "JavaScript, especially in the context of web development, is event-driven. It listens for and reacts to events like user actions, server responses, and timer expirations.",
    },
    {
      question: "How does prototype-based inheritance work in JavaScript?",
      answer:
        "JavaScript uses prototype-based inheritance rather than classical inheritance. Objects can inherit properties and methods from other objects through prototypes.",
    },
    {
      question: "What is ECMAScript in relation to JavaScript?",
      answer:
        "JavaScript is standardized by ECMAScript (ES). Major updates (ES5, ES6/ES2015, etc.) have introduced new features and syntax improvements.",
    },
    {
      question: "What is hoisting in JavaScript?",
      answer:
        "JavaScript hoists variable and function declarations to the top of their containing scope during compilation. This means you can use functions and variables before their declarations in the code.",
    },
    {
      question: "What is strict mode in JavaScript?",
      answer:
        "Enabling strict mode ('use strict';) in JavaScript changes the way some aspects of the language work, making it easier to write secure and robust code by catching common coding mistakes.",
    },
  ];

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to reset your test account",
    };
  }

  try {
    const { data: deleteData, error: deleteError } = await supabase
      .from("fragment")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.log("deleteError:", deleteError);
    }

    const { error: sessionsDeleteError } = await supabase
      .from("practice_session")
      .delete()
      .eq("user_id", user.id);

    if (sessionsDeleteError) {
      console.log("sessionsDeleteError:", sessionsDeleteError);
    }

    const { error: profileError } = await supabase
      .from("profile")
      .update({ first_name: "Testy", last_name: "McTestface" })
      .eq("user_id", user.id);

    for (let fragment of sampleFragments) {
      const { error: insertError } = await supabase.from("fragment").insert({
        question: fragment.question,
        answer: fragment.answer,
        user_id: user.id,
        next_show_date: tomorrow(),
      });
    }
    revalidatePath("/practice");
    return {
      success: true,
      message:
        "Reset successful! You can start practicing here, or add your own fragments on the create page 🎉",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong, please try again 😢",
    };
  }
}
