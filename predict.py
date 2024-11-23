# Flow
#	Inputs:
#		- presence romania + foreign
#       - results europarl.
#		- Conversion matrix between europarl and presidential
import re

import matplotlib.pyplot as plt
import bs4
import urllib.request
from datetime import datetime

def get_ro_votes():
    link = "https://www.rezultatevot.ro/alegeri/prezidentiale-turul-1-2024/prezenta?nivel=N"
    r = urllib.request.urlopen(link)
    soup = bs4.BeautifulSoup(r, "html.parser")
    final_text = ""
    for line in soup.text:
        if not str.isspace(line):
            final_text += line
    x = final_text.split("Auvotat")[1]
    votes_ro = x.split("Distribuție")[0]
    votes_ro = votes_ro.split('(')[1].split(')')[0].replace('.', '')
    return int(votes_ro)

def get_foreign_votes():
    link = "https://www.rezultatevot.ro/alegeri/prezidentiale-turul-1-2024/prezenta?nivel=D"
    r = urllib.request.urlopen(link)
    soup = bs4.BeautifulSoup(r, "html.parser")
    final_text = ""
    for line in soup.text:
        if not str.isspace(line):
            final_text += line
    x = final_text.split("DiasporaAuvotat")[1]
    votes_foreign = x.split("Distribuție")[0].replace('.','')
    return int(votes_foreign)

#percent of vote
RESULTS_EUROPARL = \
    {
        "Romania": {
            "PSD+PNL": 49.21,
            "USR+PMP+FD": 8.53,
            "UDMR": 6.61,
            "AUR": 14.93,
            "SOS": 4.83,
            "REPER": 3.6,
            "STEFANUTA": 3.02,
            "VLADGHE": 2.41,
            "DIASPORA UNITA": 1.66,
            "PUSL": 1.5, # probabil efect piedone
            "OBSCURI": 3.3 # silvestru sosoaca, prm, patrioti, romania socialista
        },
        "Foreign": {
            "PSD+PNL": 21.35,
            "USR+PMP+FD": 16.34,
            "UDMR": 1.04,
            "AUR": 14.65,
            "SOS": 13.52,
            "REPER": 9.7,
            "STEFANUTA": 5.9,
            "VLADGHE": 5.12,
            "DIASPORA UNITA": 7.05,
            "PUSL": 0.87,
            "OBSCURI": 4.4  # silvestru sosoaca, prm, patrioti, romania socialista
        }
    }

CONV_MATRIX = { # party to candidate conversion
    "PSD+PNL": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0.04, # conversie ciuca
        "GEORGE SIMION": 0.02,
        "MARCEL CIOLACU": 0.50,
        "NICOLAE CIUCA": 0.25,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.10,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0.02,
        "CRISTIAN DIACONESCU": 0.04,
        "CRISTIAN TERHES": 0.01,
        "SILVIU PREDOIU": 0
    },
    "USR+PMP+FD": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0.85,
        "GEORGE SIMION": 0.02,
        "MARCEL CIOLACU": 0.02,
        "NICOLAE CIUCA": 0.01,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.01,
        "ANA BIRCHALL": 0.0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0.01,
        "CALIN GEORGESCU": 0.01,
        "CRISTIAN DIACONESCU": 0.02,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "UDMR": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0,
        "GEORGE SIMION": 0,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 1, #Simplificare
        "MIRCEA GEOANA": 0,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "AUR": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0,
        "GEORGE SIMION": 0.85,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0.15,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "SOS": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0,
        "GEORGE SIMION": 0.3,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0.65,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0.02,
        "SILVIU PREDOIU": 0
    },
    "REPER": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0.80,
        "GEORGE SIMION": 0.01,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.04,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0,
        "CRISTIAN DIACONESCU": 0.05,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "STEFANUTA": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0.8,
        "GEORGE SIMION": 0.01,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0,
        "ANA BIRCHALL": 0.05,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0,
        "CRISTIAN DIACONESCU": 0.04,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "VLADGHE": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0.8,
        "GEORGE SIMION": 0.05,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.05,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0.0,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "DIASPORA UNITA": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0,
        "GEORGE SIMION": 0.5,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0.1,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.1,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0.25,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0.05,
        "SILVIU PREDOIU": 0
    },
    "PUSL": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0,
        "GEORGE SIMION": 0.25,
        "MARCEL CIOLACU": 0.5,
        "NICOLAE CIUCA": 0.10,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.15,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0,
        "SILVIU PREDOIU": 0
    },
    "OBSCURI": { # How much of the vote will be converted by the candidate.
        "ELENA LASCONI": 0,
        "GEORGE SIMION": 0.33,
        "MARCEL CIOLACU": 0,
        "NICOLAE CIUCA": 0,
        "KELEMEN HUNOR": 0,
        "MIRCEA GEOANA": 0.1,
        "ANA BIRCHALL": 0,
        "ALEXANDRA PACURARU": 0,
        "SEBASTIAN CONTANTIN POPESCU": 0,
        "LUDOVIC ORBAN": 0,
        "CALIN GEORGESCU": 0.33,
        "CRISTIAN DIACONESCU": 0,
        "CRISTIAN TERHES": 0.1,
        "SILVIU PREDOIU": 0.1
    },
}

#useful helpers:
CANDIDATES = [  "ELENA LASCONI", "GEORGE SIMION", "MARCEL CIOLACU",
                "NICOLAE CIUCA", "KELEMEN HUNOR", "MIRCEA GEOANA", "ANA BIRCHALL",
                "ALEXANDRA PACURARU", "SEBASTIAN CONTANTIN POPESCU", "LUDOVIC ORBAN",
                "CALIN GEORGESCU", "CRISTIAN DIACONESCU", "CRISTIAN TERHES", "SILVIU PREDOIU"]

PARTIES = [ "PSD+PNL", "USR+PMP+FD", "UDMR", "AUR", "SOS",
            "REPER", "STEFANUTA", "VLADGHE", "DIASPORA UNITA",
            "PUSL", "OBSCURI"]

CANDIDATES_COLORS = dict.fromkeys(CANDIDATES,"tab:gray")
CANDIDATES_COLORS = {"ELENA LASCONI":"tab:blue", "GEORGE SIMION":"#FFD700", "MARCEL CIOLACU": "tab:red",
                    "NICOLAE CIUCA":"blue", "KELEMEN HUNOR":"tab:green", "MIRCEA GEOANA":"magenta",
                    "CALIN GEORGESCU": "tab:orange", "ALTII":"tab:gray"}

def check_matrix(conv_matrix):
    """
    Checks the conversion matrix for anomalies
    """
    # parse euro-parliamentary results
    for party in conv_matrix:
        conv_numbers = conv_matrix[party]
        total = float(0)
        for key in conv_numbers:
            total += conv_numbers[key]

        if 0.9 <= total <= 1:
            continue
        print ("Warning: Party conversion for {0} not between 0.9 and 1, calculated as {1}. Results will be incorrect!".
            format(party, total))

def calculate_results_separately(votes_romania, votes_foreign):
    results_romania = dict.fromkeys(CANDIDATES, 0)
    results_diaspora = dict.fromkeys(CANDIDATES, 0)
    euro_results_ro = dict.fromkeys(PARTIES)
    euro_results_foreign = dict.fromkeys(PARTIES)

    # Calculate Europarliamentary results for Romania and diaspora
    for party in PARTIES:
        euro_results_ro[party] = int(RESULTS_EUROPARL["Romania"][party] / 100 * votes_romania)
        euro_results_foreign[party] = int(RESULTS_EUROPARL["Foreign"][party] / 100 * votes_foreign)

    # Map Euro results to candidates
    for candidate in CANDIDATES:
        for party in PARTIES:
            results_romania[candidate] += int(euro_results_ro[party] * CONV_MATRIX[party][candidate])
            results_diaspora[candidate] += int(euro_results_foreign[party] * CONV_MATRIX[party][candidate])

    # Calculate total results
    results_total = {candidate: results_romania[candidate] + results_diaspora[candidate] for candidate in CANDIDATES}

    return results_romania, results_diaspora, results_total


# function to add value labels
def addlabels(x,y):
    for i in range(len(x)):
        plt.text(i, y[i], y[i], ha = 'center')

def run_predictor(votes_romania, votes_foreign):
    check_matrix(CONV_MATRIX)

    # Get separate results for Romania, diaspora, and total
    results_romania, results_diaspora, results_total = calculate_results_separately(votes_romania, votes_foreign)

    # Calculate percentages for overall results
    total_votes = votes_romania + votes_foreign
    overall_results = {candidate: round(results_total[candidate] * 100 / total_votes, 2) for candidate in CANDIDATES}

    # Sort all results for better readability
    overall_results = dict(sorted(overall_results.items(), key=lambda item: item[1], reverse=True))
    results_romania = dict(sorted(results_romania.items(), key=lambda item: item[1], reverse=True))
    results_diaspora = dict(sorted(results_diaspora.items(), key=lambda item: item[1], reverse=True))

    return overall_results, results_romania, results_diaspora

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    # TODO: fetch automatically
    votes_ro = get_ro_votes()
    votes_foreign = get_foreign_votes() # 2019
    valid_votes_perc = 0.96
    run_predictor(votes_ro * valid_votes_perc, votes_foreign * valid_votes_perc)