export function mockRequest<T>(response: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => { resolve(response) }, 1000)
  })
}

