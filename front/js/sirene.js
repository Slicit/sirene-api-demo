$(document).ready(() => {
    /**
     * Class ApiSirene
     */
    class ApiSirene
    {
        /**
         *
         */
        constructor() {
            this.apiUri = 'http://localhost:42042';
            this.searchEndpoint = this.apiUri + '/search/#FULLTEXT?page=#PAGE&per_page=#PER_PAGE';
            this.showEndpoint = this.apiUri + '/show/#SIRET';
        }

        /**
         *
         * @param table
         */
        assignTable(table) {
            this.table = table;
        }

        goToPage(page) {
            page = parseInt(page);
            this.search(this.lastFulltext, page);
        }

        /**
         *
         * @param fulltext
         * @param page
         * @param perPage
         */
        search (fulltext, page, perPage) {
            this.lastFulltext = fulltext;
            collection.show();
            etablissement.hide();

            page = (page === undefined) ? 1 : parseInt(page);
            perPage = (perPage === undefined) ? 10 : parseInt(perPage);

            const endpoint = this.searchEndpoint
                .replace('#FULLTEXT', fulltext)
                .replace('#PAGE', page)
                .replace('#PER_PAGE', perPage);

            $.ajax({
                url: endpoint,
                dataType: 'json',
                success: (payload) => {
                    if (payload.collection &&
                        payload.collection.hasOwnProperty('total_results')) {
                        // Continue
                        this.table.fill(payload.collection.etablissement);
                        this.table.generatePagination(
                            payload.collection.total_results,
                            payload.collection.page,
                            payload.collection.per_page,
                            payload.collection.total_pages);
                    } else {
                        cuteAlert({
                            type: 'info',
                            title: 'No results!',
                            message: 'Please try again, there is no result matching your request!',
                            buttonText: 'OK'
                        });
                    }
                },
                error: (payload) => {
                    cuteAlert({
                        type: 'error',
                        title: 'Error!',
                        message: payload.message,
                        buttonText: 'OK'
                    });
                }
            });
        }

        /**
         *
         * @param siret
         */
        show (siret) {
            collection.hide();
            etablissement.show();
            paginator.empty();

            const endpoint = this.showEndpoint.replace('#SIRET', siret);

            $.ajax({
                url: endpoint,
                dataType: 'json',
                success: (payload) => {
                    if (payload.item &&
                        payload.item.etablissement) {
                        // Continue
                        this.table.renderOneItem(payload.item.etablissement);
                    } else {
                        cuteAlert({
                            type: 'info',
                            title: 'No result!',
                            message: 'Please try again, there is no result matching your request!',
                            buttonText: 'OK'
                        });
                    }
                },
                error: (payload) => {
                    cuteAlert({
                        type: 'error',
                        title: 'Error!',
                        message: payload.message,
                        buttonText: 'OK'
                    });
                }
            });
        }
    }

    class DynamicTable
    {
        /**
         *
         * @param tableId
         * @returns {DynamicTable}
         */
        constructor(tableId) {
            this.tableId = tableId;
            this.$table = $(tableId);

            return this;
        }

        init(columns) {
            this.columnsIndex = [];
            let thead = this.$table.find('thead');

            thead.empty();
            for (let columnIndex in columns) {
                let tmpColumn = columns[columnIndex];
                thead.append(`<th scope="col">${tmpColumn.label}</th>`);
                this.columnsIndex.push(tmpColumn.key);
            }
            // Action column!
            thead.append(`<th/>`);
        }

        initSingle(columns) {
            this.columnsIndex = columns;
        }

        fill(collection) {
            let tbody = this.$table.find('tbody');
            let thead = this.$table.find('thead');
            thead.show();
            this.clear();
            for (let itemIndex in collection) {
                let tmpItem = collection[itemIndex];
                let tr = $('<tr/>');
                for (let columnIndex in this.columnsIndex) {
                    let tmpColumn = this.columnsIndex[columnIndex];
                    if (tmpItem.hasOwnProperty(tmpColumn)) {
                        let tmpValue = tmpItem[tmpColumn] ?? '-';
                        tr.append(`<td>${tmpValue}</td>`);
                    } else {
                        tr.append(`<td/>`);
                    }
                }
                // Action column!
                tr.append(`
<td>
    <button type="button" 
            class="btn btn-sm btn-success text-light"
            onclick="window.apiShow.show('${tmpItem['siret']}')">VIEW</button>
</td>`);
                tbody.append(tr);
            }
        }

        renderOneItem(item) {
            let tbody = this.$table.find('tbody');
            tbody.empty();
            let thead = this.$table.find('thead');
            thead.hide();

            for (let columnIndex in this.columnsIndex) {
                let tmpColumn = this.columnsIndex[columnIndex];
                let tmpValue = item[tmpColumn.key] ?? '-';
                let tr = $(`<tr/>`);
                tr.append(`<th>${tmpColumn.label}</th><td>${tmpValue}</td>`);
                tbody.append(tr);
            }
        }

        clear() {
            let tbody = this.$table.find('tbody');
            tbody.empty();
        }

        generatePagination(total, currentPage, perPage, totalPages) {
            let numberOfPages = Math.round(total / perPage);
            if (numberOfPages === 0) {
                return;
            }
            let templatePaginator = `
<div class="btn-group mr-2" 
     role="group" 
     aria-label="First group">
    <button type="button"
            class="btn btn-light">${currentPage} / ${totalPages}</button>
</div>
<div class="btn-group mr-2" 
     role="group" 
     aria-label="Second group">
     
             
     <button type="button" 
             onclick="window.apiSearch.goToPage(1)"
             class="btn btn-secondary">FIRST</button>`;

            if (currentPage > 2) {
                templatePaginator += `
     <button type="button" 
             onclick="window.apiSearch.goToPage(${parseInt(currentPage) - 2})"
             class="btn btn-secondary">${parseInt(currentPage) - 2}</button>`;
            }

            if (currentPage > 1) {
                templatePaginator += `
     <button type="button" 
             onclick="window.apiSearch.goToPage(${parseInt(currentPage) - 1})"
             class="btn btn-secondary">${parseInt(currentPage) - 1}</button>`;
            }

            templatePaginator += `
     <button type="button" 
             onclick="window.apiSearch.goToPage(${parseInt(currentPage)})"
             class="btn btn-primary">${parseInt(currentPage)}</button>`;

            if (currentPage < totalPages) {
                templatePaginator += `
     <button type="button" 
             onclick="window.apiSearch.goToPage(${parseInt(currentPage) + 1})"
             class="btn btn-secondary">${parseInt(currentPage) + 1}</button>`;
            }

            if (currentPage < totalPages - 1) {
                templatePaginator += `
     <button type="button" 
             onclick="window.apiSearch.goToPage(${parseInt(currentPage) + 2})"
             class="btn btn-secondary">${parseInt(currentPage) + 2}</button>`;
            }

            templatePaginator += `
     <button type="button" 
             onclick="window.apiSearch.goToPage(${totalPages})"
             class="btn btn-secondary">LAST</button>
</div>`;

            paginator.empty().append(templatePaginator);
        };
    }

    // exports like!
    window.ApiSirene = ApiSirene;
    window.DynamicTable = DynamicTable;

    const paginator = $('#paginator');
    const inputSearch = $('.input-search');
    const collection = $('#collection');
    const etablissement = $('#etablissement');
    const actionHome = $('.action-home');

    // Initializing the logic!
    let searchTable = new DynamicTable('#collection');
    searchTable.init([
        {
            key: 'id',
            label: '#ID'
        },
        {
            key: 'nom_raison_sociale',
            label: 'Raison sociale'
        },
        {
            key: 'siret',
            label: 'SIRET'
        },
        {
            key: 'geo_adresse',
            label: 'Adresse'
        },
        {
            key: 'libelle_activite_principale',
            label: 'Activit&eacute;'
        }
    ]);

    window.apiSearch = new ApiSirene();
    window.apiSearch.assignTable(searchTable);

    let showTable = new DynamicTable('#etablissement');
    showTable.initSingle([
        {
            key: 'id',
            label: '#ID'
        },
        {
            key: 'nom_raison_sociale',
            label: 'Raison sociale'
        },
        {
            key: 'siret',
            label: 'SIRET'
        },
        {
            key: 'geo_adresse',
            label: 'Adresse'
        },
        {
            key: 'activite_principale',
            label: 'NAF'
        },
        {
            key: 'libelle_activite_principale',
            label: 'Activit&eacute;'
        },
        {
            key: 'date_creation',
            label: 'Date de cr&eacute;ation'
        },
        {
            key: 'libelle_nature_juridique_entreprise',
            label: 'Forme sociale'
        }
    ]);

    window.apiShow = new ApiSirene();
    window.apiShow.assignTable(showTable);

    actionHome.off('click');
    actionHome.on('click', function () {
        showTable.clear();
        searchTable.clear();
        etablissement.hide();
        collection.show();
        inputSearch.val('');
        window.apiSearch.search('Alice IW');
    });

    inputSearch.off('keyup');
    inputSearch.on('keyup', $.debounce(250, function () {
        window.apiSearch.search($(this).val());
    }));

    // Default search at load
    actionHome.trigger('click');
});