library( shiny )
library( bs4Dash )

# Define UI for application that draws a histogram
ui <- bs4Dash::bs4DashPage(
    sidebar = bs4Dash::bs4DashSidebar( disable = T ),
    navbar = bs4Dash::bs4DashNavbar( 
        skin = "light",
        leftUi = HTML( "<font color=#428BC8><h2><b>Pandemic Simulation</b></h2></font>" ),
        rightUi = HTML( "<a href=https://tpeschel.github.io/Pandemia/><h3>home</h3></a>" ),
        controlbarIcon = NULL
    ),
    controlbar = bs4Dash::bs4DashControlbar(
        disable = T
    ),
    body = bs4Dash::bs4DashBody(
        bs4Dash::bs4Card(
            title = "Settings",
            fluidRow(
                column(
                    sliderInput(
                        inputId = "ID_SI_COUNT_X",
                        label = "Individuals per row",
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
                        label = "Individuals per column",
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
                        label = "Radius / Distance ~ Reciproke Volume / Space",
                        min = 10,
                        max = 25,
                        value = 15,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_VEL",
                        label = "Agility",
                        min = 0,
                        max = 1000,
                        value = 500,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_DAMP",
                        label = "Damping of Agility in Quarantine",
                        min = 0,
                        max = 1,
                        value = 0.5,
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
                        inputId = "ID_SI_ACC_QUARA",
                        label = "Social Distancing in Quarantine",
                        min = 1,
                        max = 10,
                        value = 2,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_MORTALITY_INSIDE",
                        label = "Lethality inside Health Care System in %",
                        min   = 0,
                        max   = 100,
                        value = 5,
                        step  = 1,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_MORTALITY_OUTSIDE",
                        label   = "Lethality outside Health Care System in %",
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
                        label = "Capacity of Health Care System in %",
                        min = 0,
                        max = 100,
                        value = 10,
                        step = 1,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_ST",
                        label = "Duration of Infection",
                        min = 1,
                        max = 1000,
                        value = 500,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    sliderInput(
                        inputId = "ID_SI_SEED",
                        label = "Seed of Random Generator",
                        min = 1,
                        max = 1000,
                        value = 500,
                        width = "100%"
                    ),
                    width = 4,
                ),
                column(
                    checkboxGroupInput(
                        inputId  = "ID_CB_WALLS",
                        label    = "Barriers",
                        choices  = c( "Vertical Left", "Vertical Center", "Vertical Right", "Horizontal" ),
                        selected = "Vertical Center",
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
            title = "Pandemic Simulation",
            includeHTML( "www/pandemia.html" ),
            width = 12,
            #height = "100%",
            closable = F,
            maximizable = T
        )
    ),
    footer = bs4Dash::bs4DashFooter(
        HTML( '<a href="https://tpeschel.github.io/Pandemia/">https://tpeschel.github.io/Pandemia</a>' )
    )
)

# Define server logic required to draw a histogram
server <- function( input, output ) {

}

# Run the application 
shinyApp(ui = ui, server = server)
