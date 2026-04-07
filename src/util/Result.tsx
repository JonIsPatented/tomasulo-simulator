export interface Success<T> {
    ok: true
    value: T
}

export interface Failure<E> {
    ok: false
    error: E
}

export type Result<T, E> = Success<T> | Failure<E>

export const success = <T,>(value: T): Success<T> => ({
    ok: true,
    value: value,
})

export const failure = <E,>(error: E): Failure<E> => ({
    ok: false,
    error: error,
})
