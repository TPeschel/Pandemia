library( shiny )
library( bs4Dash )

# Define UI for application that draws a histogram
ui <- bs4Dash::bs4DashPage(
    sidebar = bs4Dash::bs4DashSidebar( disable = T ),
    navbar = bs4Dash::bs4DashNavbar( 
        skin = "light",
        leftUi = HTML( "<a href=https://tpeschel.github.io/Pandemia/><h3>Pandemie Simulation</h3></a>" ),
        controlbarIcon = NULL
    ),
    controlbar = bs4Dash::bs4DashControlbar(
        disable = T
    ),
    body = bs4Dash::bs4DashBody(
        bs4Dash::bs4Card(
            title = "Einstellungen",
            fluidRow(
                column(
                    sliderInput(
                        inputId = "ID_SI_COUNT_X",
                        label = "Menschen pro Zeile",
                        min = 2,
                        max = 50,
                        value = 20,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_COUNT_Y",
                        label = "Menschen pro Spalte",
                        min = 1,
                        max = 25,
                        value = 10,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_RADIUS",
                        label = "Radius",
                        min = 10,
                        max = 25,
                        value = 15,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_DAMP",
                        label = "Dämpfung der Agilität in Quarantäne",
                        min = 0,
                        max = 1,
                        value = 0.5,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_ACC_QUARA",
                        label = "Isolation in Quarantäne",
                        min = 1,
                        max = 10,
                        value = 5,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_VEL",
                        label = "Agilität",
                        min = 0,
                        max = 1000,
                        value = 500,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_ACC",
                        label = "Social Distancing",
                        min = 0,
                        max = 1000,
                        value = 250,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_ST",
                        label = "Infektionsdauer",
                        min = 1,
                        max = 1000,
                        value = 250,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_MORTALITY_INSIDE",
                        label = "Mortalität innerhalb des Gesundheitswesens in %",
                        min   = 0,
                        max   = 100,
                        value = 10,
                        step  = 1,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_MORTALITY_OUTSIDE",
                        label   = "Mortalität ausserhalb des Gesundheitswesens in %",
                        min     = 0,
                        max     = 100,
                        value   = 25,
                        width   = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_MAX_HOSP",
                        label = "Kapazität des Gesundheitswesens in %",
                        min = 0,
                        max = 100,
                        value = 15,
                        step = 1,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_SEED",
                        label = "Startwert für Zufallsgenerator",
                        min = 1,
                        max = 1000,
                        value = 1,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    checkboxGroupInput(
                        inputId  = "ID_CB_WALLS",
                        label    = "Barrieren",
                        choices  = c( "Vertikal Links", "Vertikal Mitte", "Vertikal Rechts", "Horizontal" ),
                        selected = character( 0 ),
                        inline   = T,
                        width    = "100%"
                    ),
                    width = 4,
                ),
                column(
                    actionButton(
                        "ID_AB_START",
                        "START",
                        icon = icon( "start" ),
                        width = "100%"
                    ),
                    width = 12,
                )
            ),
            #skin  = "light",
            #title = "SETTTINGS",
            closable = F,
            width = 12
        ),
        bs4Dash::bs4Card(
            title = "Pandemie Simulation",
            includeHTML( "www/pandemia.html" ),
            width = 12,
            #height = "100%",
            closable = F,
            maximizable = T
        )
    ),
    footer = bs4Dash::bs4DashFooter(
        HTML( '<a href="https://github.com/TPeschel/Pandemia/">https://github.com/TPeschel/Pandemia</a>' )
    )
)

# Define server logic required to draw a histogram
server <- function( input, output ) {

}

# Run the application 
shinyApp(ui = ui, server = server)
