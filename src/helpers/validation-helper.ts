import mongoose, { type Types } from 'mongoose'

export function allNotNullOrEmpty (...values: Array<any | null | undefined>): boolean {
  return !values.every(value => value != null && value !== '')
}

export function idCheck (id: Types.ObjectId | string): boolean {
  return !mongoose.Types.ObjectId.isValid(id)
}
