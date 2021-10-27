import termkit, {NextGenEvents, Terminal} from 'terminal-kit';


const pageMenus = async (items: Array<any>, callbackHighlight: any, perPage?: number, callbackOk?: any, callbackErr?: any, term?: Terminal): NextGenEvents => {
    let menus = term.singleColumnMenu(items, {}, (error, response) => {
        if (error && callbackErr) {
            callbackErr(error);
        } else if (callbackOk) {
            callbackOk(response);
        }
    });
    menus.on('highlight', ((items) => callbackHighlight)(items));

    return menus;
};

export const paginatedMenus = async (items: Array<any>, header?: string, perPage?: number, callbackOk?: any, callbackErr?: any, term?: Terminal) => {
    if (!perPage) {
        perPage = 20;
    }
    if (!term) {
        term = termkit.terminal;
    }

    term.clear();

    let nextPageLabel = 'NEXT PAGE >>>',
        previousPageLabel = '<<< PREVIOUS PAGE',
        offset = 0,
        itemsPage = header ? [header, ...items.slice(offset * perPage, (offset + 1) * perPage), nextPageLabel] : [...items.slice(offset * perPage, (offset + 1) * perPage), nextPageLabel],
        pageSize = itemsPage.length;

    let index = 0,
        m = null,
        p = null,
        started = true;
    const getM = () => m,
        onItem = (f => e => {
            let m = f();
            if (e.highlightedIndex === itemsPage.length - 1 && e.highlightedText === nextPageLabel && !started) {
                index = 1;
                m.then((o) => {
                    if ((offset + 1) * perPage <= items.length) {
                        started = true;
                        o.hide();
                        o.abort();
                        offset++;

                        itemsPage = header ? [header, ...items.slice(offset * perPage, (offset + 1) * perPage)] : items.slice(offset * perPage, (offset + 1) * perPage);
                        if (offset) {
                            itemsPage = [previousPageLabel, ...itemsPage];
                        }
                        if (offset - 1 < items.length % perPage) {
                            itemsPage = [...itemsPage, nextPageLabel];
                        }
                        pageSize = itemsPage.length;

                        m = pageMenus(
                            itemsPage, onItem(getM), perPage, null, null, term
                        );
                    }
                });


            } else if (e.highlightedIndex === 0 && e.highlightedText === previousPageLabel && !started) {
                index = -1;
                m.then((o) => {
                    if ((offset - 1) * perPage >= 0) {
                        started = true;
                        o.hide();
                        o.abort();
                        offset--;

                        itemsPage = header ? [header, ...items.slice((offset - 1) * perPage, offset * perPage)] : items.slice((offset - 1) * perPage, offset * perPage);
                        if (offset) {
                            itemsPage = [previousPageLabel, ...itemsPage];
                        }
                        if (offset < items.length % perPage) {
                            itemsPage = [...itemsPage, nextPageLabel];
                        }
                        pageSize = itemsPage.length;

                        m = pageMenus(
                            itemsPage, onItem(getM), perPage, null, null, term
                        );
                    }
                });
            } else if (e.highlightedIndex > 0 && e.highlightedIndex < itemsPage.length - 1 && itemsPage.length > 2) {
                index = 0;
                started = false;
            }
        });

    m = pageMenus(
        itemsPage, onItem(getM), perPage, null, null, term
    );
};