const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let sheetData = {
  topics: [
    {
      id: "t1",
      title: "Arrays",
      subTopics: [
        {
          id: "s1",
          title: "Basics",
          questions: [
            {
              id: "q1",
              title: "Two Sum",
              difficulty: "Easy",
              link: "https://leetcode.com/problems/two-sum",
              completed: false
            },
            {
              id: "q2",
              title: "Best Time to Buy and Sell Stock",
              difficulty: "Easy",
              link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
              completed: false
            }
          ]
        },
        {
          id: "s2",
          title: "Prefix Sum",
          questions: [
            {
              id: "q3",
              title: "Subarray Sum Equals K",
              difficulty: "Medium",
              link: "https://leetcode.com/problems/subarray-sum-equals-k",
              completed: false
            }
          ]
        }
      ]
    },

    {
      id: "t2",
      title: "Strings",
      subTopics: [
        {
          id: "s3",
          title: "Two Pointers",
          questions: [
            {
              id: "q4",
              title: "Valid Palindrome",
              difficulty: "Easy",
              link: "https://leetcode.com/problems/valid-palindrome",
              completed: false
            },
            {
              id: "q5",
              title: "Reverse Words in a String",
              difficulty: "Medium",
              link: "https://leetcode.com/problems/reverse-words-in-a-string",
              completed: false
            }
          ]
        },
        {
          id: "s4",
          title: "Sliding Window",
          questions: [
            {
              id: "q6",
              title: "Longest Substring Without Repeating Characters",
              difficulty: "Medium",
              link: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
              completed: false
            }
          ]
        }
      ]
    },

    {
      id: "t3",
      title: "Linked List",
      subTopics: [
        {
          id: "s5",
          title: "Basics",
          questions: [
            {
              id: "q7",
              title: "Reverse Linked List",
              difficulty: "Easy",
              link: "https://leetcode.com/problems/reverse-linked-list",
              completed: false
            },
            {
              id: "q8",
              title: "Middle of the Linked List",
              difficulty: "Easy",
              link: "https://leetcode.com/problems/middle-of-the-linked-list",
              completed: false
            }
          ]
        },
        {
          id: "s6",
          title: "Fast & Slow Pointer",
          questions: [
            {
              id: "q9",
              title: "Linked List Cycle",
              difficulty: "Easy",
              link: "https://leetcode.com/problems/linked-list-cycle",
              completed: false
            }
          ]
        }
      ]
    }
  ]
};



app.get("/api/sheet", (req, res) => {
  res.json(sheetData);
});

app.post("/api/sheet", (req, res) => {
  sheetData = req.body;
  res.json({ message: "Sheet updated" });
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
