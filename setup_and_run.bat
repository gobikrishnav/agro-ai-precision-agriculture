@echo off
title Installing AgroAI ML & Jupyter Dependencies...
color 0A
echo =====================================================================
echo   🌱 AGRO-AI: INSTALLING JUPYTER, STREAMLIT & MACHINE LEARNING SUITE
echo =====================================================================
echo.
echo Step 1: Upgrading PIP package manager...
python -m pip install --upgrade pip
echo.
echo Step 2: Installing Jupyter, Streamlit, Scikit-Learn, Plotly & Algorithms...
pip install notebook jupyterlab streamlit pandas numpy scikit-learn plotly seaborn matplotlib ipywidgets requests
echo.
echo =====================================================================
echo   ✅ Installation Complete! Starting AgroAI & Jupyter Notebook...
echo =====================================================================
echo.
start cmd /k "streamlit run main.py"
start cmd /k "jupyter notebook"
echo Applications launched in separate windows!
pause
