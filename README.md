# Private English Coach

A lightweight English-learning web app focused on vocabulary review, active recall, and daily output practice.

Live demo: https://ruby-zhang711.github.io/english-coach/

## Overview

Private English Coach is a browser-based study tool for advanced English learners. It helps users turn daily vocabulary notes into review cards, schedule spaced repetition, complete short writing and speaking tasks, and keep a record of corrected mistakes.

The project was designed around a practical learning workflow:

- Paste vocabulary from daily notes
- Generate word cards with meanings, synonyms, word forms, and example contexts
- Review words through D0 / D1 / D3 / D7 / D14 / D30 memory intervals
- Practice both input and output tasks
- Save corrected writing or speaking issues into a mistake notebook

## Features

- Batch vocabulary import from plain notes
- Automatic word-card generation
- Meanings, synonyms, word forms, and context sentences
- Spaced repetition review schedule
- Daily checklist for reading, vocabulary, speaking, and writing
- Writing and speaking input areas
- Local feedback prompts for better expression
- Mistake notebook for corrected sentences
- Friend profile links using URL hash profiles
- Daily encouragement lines, streak tracking, and small easter eggs
- Browser local storage, no backend required

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages
- Browser LocalStorage

## Project Highlights

This project is intentionally simple and portable. It does not require a backend, login system, package manager, or build step. The entire app can be deployed as a static website.

Key engineering decisions:

- Static-first architecture for easy deployment and sharing
- Profile isolation through URL hash parameters
- Spaced repetition logic implemented in client-side JavaScript
- Local persistence through browser storage
- Responsive dashboard layout for desktop and mobile use
- Small motivational interactions to keep the learning loop warm and encouraging

## How It Works

Each vocabulary card stores:

- English word or phrase
- Chinese meaning
- Synonyms or related expressions
- Part of speech and word family
- Example context sentence
- Review history
- Next due date
- Mastery status

The review schedule follows:

`D0 -> D1 -> D3 -> D7 -> D14 -> D30`

Users can mark answers as correct or difficult. Difficult cards return to the next-day review queue.

## Friend Profiles

The app supports simple friend-specific links:

```text
https://ruby-zhang711.github.io/english-coach/#profile=amanda&name=Amanda
```

Each profile stores data separately in the same browser. This makes it easy to share the app with different learners while keeping their practice spaces separate.

## Future Improvements

- Cloud sync and user accounts
- AI-powered sentence correction
- Larger vocabulary dictionary
- Export/import for vocabulary history
- Weekly review reports
- Speaking pronunciation scoring
- Teacher dashboard for multiple learners

## Author

Built by Ruby Zhang as a personal English-learning and productivity project.
