export class Filter {
    filterByName(items, searchTerm) {
        return items.filter((item) => {
            return item.nombre.toLowerCase().indexOf(
                searchTerm.toLowerCase()) > -1;
        });
    }
}