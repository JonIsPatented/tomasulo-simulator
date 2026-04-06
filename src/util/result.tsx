export interface Success<T> {
    ok: true
    value: T
}

export interface Failure<E> {
    ok: false
    error: E
}

export type Result<T, E> = Success<T> | Failure<E>

