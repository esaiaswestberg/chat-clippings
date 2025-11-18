import { uid } from '../utils/uid'

export const defaultData = [
  { id: uid(), name: 'Greetings', phrases: [{ id: uid(), text: 'Hello!' }, { id: uid(), text: 'Hi there' }] },
  { id: uid(), name: 'Sign-offs', phrases: [{ id: uid(), text: 'Take care' }, { id: uid(), text: 'Thanks!' }] }
]
