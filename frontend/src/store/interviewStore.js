import { create } from "zustand";

export const useInterviewStore = create((set) => ({
  questions: [],

  currentQuestionIndex: 0,

  userAnswers: {},

  isRecording: false,

  setRecording: (status) => set({ isRecording: status }),

  setQuestions: (questions) => set({ questions }),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  saveAnswer: (questionIndex, answer) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionIndex]: answer },
    })),

  resetInterview: () =>
    set({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      isRecording: false,
    }),
}));
