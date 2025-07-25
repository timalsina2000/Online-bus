
export const MainNav = [
    {
        icon: 'pe-7s-rocket',
        label: 'Dashboard Example',
        to: '#/forms/new-categorie',
    },
];
export const ComponentsNav = [
    {
        icon: 'pe-7s-diamond',
        label: 'Elements',
        content: [
            {
                label: 'Standard Buttons',
                to: '#/elements/buttons-standard',
            },
            {
                label: 'Dropdowns',
                to: '#/elements/dropdowns',

            },
            {
                label: 'Icons',
                to: '#/elements/icons',
            },
            {
                label: 'Badges',
                to: '#/elements/badges-labels',
            },
            {
                label: 'Cards',
                to: '#/elements/cards',
            },
            {
                label: 'List Groups',
                to: '#/elements/list-group',
            },
            {
                label: 'Navigation Menus',
                to: '#/elements/navigation',
            },
            {
                label: 'Utilities',
                to: '#/elements/utilities',
            },
        ],
    },
    {
        icon: 'pe-7s-car',
        label: 'Components',
        content: [
            {
                label: 'Tabs',
                to: '#/components/tabs',
            },
            {
                label: 'Notifications',
                to: '#/components/notifications',
            },
            {
                label: 'Modals',
                to: '#/components/modals',
            },
            {
                label: 'Progress Bar',
                to: '#/components/progress-bar',
            },
            {
                label: 'Tooltips & Popovers',
                to: '#/components/tooltips-popovers',
            },
            {
                label: 'Carousel',
                to: '#/components/carousel',
            },
            {
                label: 'Maps',
                to: '#/components/maps',
            },
        ],
    },
    {
        icon: 'pe-7s-display2',
        label: 'Regular Tables',
        to: '#/tables/regular-tables',
    },
];
export const FormsNav = [
    // {
    //     icon: 'pe-7s-light',
    //     label: 'Control',
    //     to: '#/forms/control',
    // },
    // {
    //     icon: 'pe-7s-eyedropper',
    //     label: 'Layouts',
    //     to: '#/forms/categories',
    // },
    // {
    //     icon: 'pe-7s-pendrive',
    //     label: 'Validation',
    //     to: '#/forms/validation',
    // },
    {
        icon: 'pe-7s-folder',
        label: 'Categories',
        to: '#/forms/layouts',
        content: [

            {
                label:'menu',
                to: '#/forms/new-menu',
            },
          {
            label: 'All places',
            to: '#/forms/layouts',
          },
          {
            label: 'New places',
            to: '#/forms/new-categories',
          },
          {
            label: 'Add New ticket',
            to: '#/forms/add-post',
          },
          {
            label: 'All ticket',
            to: '#/forms/new-post',
          },
          {
            label: 'booked-ticket',
            to: '#/forms/book-post',
          },
        ],
      },
];
export const WidgetsNav = [
    {
        icon: 'pe-7s-graph2',
        label: 'Dashboard Boxes',
        to: '#/widgets/chart-boxes-3',
    },
];
export const ChartsNav = [
    {
        icon: 'pe-7s-graph2',
        label: 'ChartJS',
        to: '#/charts/chartjs',
    },
];

