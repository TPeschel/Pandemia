library( shiny )
library( bs4Dash )

# Define UI for application that draws a histogram
ui <- bs4Dash::bs4DashPage(
    sidebar = bs4Dash::bs4DashSidebar( disable = T ),
    navbar = bs4Dash::bs4DashNavbar( ),
    controlbar = bs4Dash::bs4DashControlbar(
        fluidRow(
            column(
                sliderInput(
                    inputId = "ID_SI_COUNT_X",
                    label = "people in a row",
                    min = 2,
                    max = 50,
                    value = 20,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_COUNT_Y",
                    label = "people in a column",
                    min = 1,
                    max = 25,
                    value = 10,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_RADIUS",
                    label = "radius",
                    min = 5,
                    max = 30,
                    value = 15,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_VEL",
                    label = "velocity",
                    min = 10,
                    max = 100,
                    value = 15,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_ACC",
                    label = "repulsivity",
                    min = 0,
                    max = 1000,
                    value = 250,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_ST",
                    label = "time one is sick",
                    min = 1,
                    max = 1000,
                    value = 250,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_MAX_HOSP",
                    label = "capacity of health care system",
                    min = 0,
                    max = 1,
                    value = .2,
                    step = .01,
                    width = "100%"
                ),
                width = 6,
            ),
            column(
                sliderInput(
                    inputId = "ID_SI_SEED",
                    label = "seed",
                    min = 1,
                    max = 1000,
                    value = 1,
                    width = "100%"
                ),
                width = 6,
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
        skin  = "light",
        title = "SETTTINGS",
        width = 300
    ),
    body = bs4Dash::bs4DashBody( 
        bs4Dash::bs4Card(
            title = "Corona",
            includeHTML( "www/pandemia.html" ),
            width = 12,
            #height = "100%",
            closable = F,
            maximizable = T
        )
    ),
    footer = bs4Dash::bs4DashFooter( )
)

# Define server logic required to draw a histogram
server <- function( input, output ) {

}

# Run the application 
shinyApp(ui = ui, server = server)
