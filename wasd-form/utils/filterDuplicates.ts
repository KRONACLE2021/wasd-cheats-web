export default function filterDuplicates<T>(array: T[], areEqual: ((a: T, b: T) => boolean)): T[] {
    return array.filter((item: T, pos: number) => {
      return array.findIndex((other: T) => areEqual(item, other)) == pos;
    });
}
