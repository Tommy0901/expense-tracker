import mongoose from 'mongoose'

export function connectToMongoDB (uri: string): void {
  void mongoose.connect(uri)

  mongoose.connection.once('open', () => {
    console.log('MongoDB connection success!')
  })

  mongoose.connection.on('error', () => {
    console.log('MongoDB connection error!')
  })
}

export function disconnectFromMongoDB (): void {
  void mongoose.disconnect()
}
